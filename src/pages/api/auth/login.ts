import { NextApiRequest, NextApiResponse } from 'next';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

// Types
interface LoginRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}

interface LoginResponse {
  success?: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: string | null;
    role: UserRole;
    createdAt: Date;
    lastLogin?: Date | null;
  };
  token?: string;
  expiresIn?: string;
  error?: string;
}

// JWT秘密キーの検証
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  if (secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }
  return secret;
}

// 入力値のサニタイゼーション
function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// レート制限（シンプルな実装 - 本番では Redis 推奨）
const loginAttempts = new Map<string, { count: number; lastAttempt: number; }>();
const MAX_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10);
const LOCKOUT_TIME = parseInt(process.env.LOGIN_LOCKOUT_MINUTES || '15', 10) * 60 * 1000;

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
  
  // ロックアウト時間が過ぎていればリセット
  if (now - attempts.lastAttempt > LOCKOUT_TIME) {
    loginAttempts.set(email, { count: 0, lastAttempt: now });
    return true;
  }
  
  // 最大試行回数を超えている場合
  if (attempts.count >= MAX_ATTEMPTS) {
    return false;
  }
  
  return true;
}

function recordFailedAttempt(email: string): void {
  const now = Date.now();
  const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
  loginAttempts.set(email, { 
    count: attempts.count + 1, 
    lastAttempt: now 
  });
}

// メールアドレス形式の検証
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// メイン認証ハンドラー
export default async function handler(
  req: LoginRequest,
  res: NextApiResponse<LoginResponse>
) {
  // セキュリティヘッダーの設定
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'POSTメソッドのみ許可されています' 
    });
  }

  try {
    // JWT秘密キーの存在確認
    const jwtSecret = getJwtSecret();

    const { email, password } = req.body;

    // 入力検証
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'メールアドレスとパスワードを入力してください' 
      });
    }

    // メールアドレスの形式チェック
    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: '有効なメールアドレスを入力してください' 
      });
    }

    // パスワードの最小長チェック
    if (password.length < 8) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'パスワードは8文字以上である必要があります' 
      });
    }

    const sanitizedEmail = sanitizeEmail(email);

    // レート制限チェック
    if (!checkRateLimit(sanitizedEmail)) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded',
        message: `ログイン試行回数が上限に達しました。${Math.floor(LOCKOUT_TIME / 60000)}分後に再試行してください` 
      });
    }

    // データベースからユーザーを検索
    const user = await prisma.user.findUnique({
      where: { 
        email: sanitizedEmail,
        isActive: true // アクティブなユーザーのみ
      },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        createdAt: true,
        lastLogin: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      recordFailedAttempt(sanitizedEmail);
      return res.status(401).json({ 
        error: 'Authentication failed',
        message: 'メールアドレスまたはパスワードが正しくありません' 
      });
    }

    // パスワードの検証
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      recordFailedAttempt(sanitizedEmail);
      return res.status(401).json({ 
        error: 'Authentication failed',
        message: 'メールアドレスまたはパスワードが正しくありません' 
      });
    }

    // 成功時はレート制限をリセット
    loginAttempts.delete(sanitizedEmail);

    // 最終ログイン時刻を更新
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // JWTトークンの生成
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000)
      },
      jwtSecret,
      { 
        expiresIn: process.env.SESSION_TIMEOUT ? `${process.env.SESSION_TIMEOUT}s` : '7d',
        issuer: 'gyoseishoshi-learning',
        audience: 'gyoseishoshi-users'
      }
    );

    // パスワードを除外してレスポンス
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: 'ログインに成功しました',
      user: userWithoutPassword,
      token,
      expiresIn: process.env.SESSION_TIMEOUT ? `${process.env.SESSION_TIMEOUT}s` : '7d'
    });

  } catch (error) {
    console.error('Login error:', error);
    
    // JWT_SECRET関連のエラーは別途処理
    if (error instanceof Error && error.message.includes('JWT_SECRET')) {
      return res.status(500).json({ 
        error: 'Configuration error',
        message: 'サーバー設定に問題があります。管理者にお問い合わせください' 
      });
    }

    // データベース接続エラーの処理
    if (error instanceof Error && (
      error.message.includes('connect') ||
      error.message.includes('timeout') ||
      error.message.includes('database')
    )) {
      console.error('Database connection error:', error.message);
      return res.status(503).json({ 
        error: 'Service unavailable',
        message: 'サービスが一時的に利用できません。しばらくしてから再試行してください' 
      });
    }

    res.status(500).json({ 
      error: 'Internal server error',
      message: 'サーバーエラーが発生しました' 
    });
  }
}