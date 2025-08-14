import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

// Types
interface RegisterRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  };
}

interface RegisterResponse {
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
    isActive: boolean;
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
function sanitizeInput(input: string): string {
  return input.trim();
}

function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// パスワード強度チェック
function validatePassword(password: string): string[] {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('パスワードは8文字以上である必要があります');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('パスワードには大文字を含める必要があります');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('パスワードには小文字を含める必要があります');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('パスワードには数字を含める必要があります');
  }
  
  // 特殊文字チェック（オプション）
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('パスワードには特殊文字を含めることを推奨します');
  }
  
  return errors;
}

// メールアドレス形式の検証
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// レート制限（簡単な実装 - 本番では Redis 推奨）
const registrationAttempts = new Map<string, { count: number; lastAttempt: number; }>();
const MAX_REGISTRATION_ATTEMPTS = parseInt(process.env.MAX_REGISTRATION_ATTEMPTS || '3', 10);
const REGISTRATION_LOCKOUT_TIME = parseInt(process.env.REGISTRATION_LOCKOUT_HOURS || '1', 10) * 60 * 60 * 1000;

function checkRegistrationRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempts = registrationAttempts.get(ip) || { count: 0, lastAttempt: 0 };
  
  // ロックアウト時間が過ぎていればリセット
  if (now - attempts.lastAttempt > REGISTRATION_LOCKOUT_TIME) {
    registrationAttempts.set(ip, { count: 0, lastAttempt: now });
    return true;
  }
  
  // 最大試行回数を超えている場合
  if (attempts.count >= MAX_REGISTRATION_ATTEMPTS) {
    return false;
  }
  
  return true;
}

function recordRegistrationAttempt(ip: string): void {
  const now = Date.now();
  const attempts = registrationAttempts.get(ip) || { count: 0, lastAttempt: 0 };
  registrationAttempts.set(ip, { 
    count: attempts.count + 1, 
    lastAttempt: now 
  });
}

// クライアントIPの取得
function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' 
    ? forwarded.split(',')[0].trim()
    : req.socket.remoteAddress || 'unknown';
  return ip;
}

// メイン登録ハンドラー
export default async function handler(
  req: RegisterRequest,
  res: NextApiResponse<RegisterResponse>
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

    // レート制限チェック
    const clientIp = getClientIP(req);
    if (!checkRegistrationRateLimit(clientIp)) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded',
        message: `登録試行回数が上限に達しました。${Math.floor(REGISTRATION_LOCKOUT_TIME / (60 * 60 * 1000))}時間後に再試行してください` 
      });
    }

    const { email, password, username, firstName, lastName } = req.body;

    // 入力検証
    if (!email || !password) {
      recordRegistrationAttempt(clientIp);
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'メールアドレスとパスワードは必須です' 
      });
    }

    // メールアドレスの形式チェック
    if (!isValidEmail(email)) {
      recordRegistrationAttempt(clientIp);
      return res.status(400).json({ 
        error: 'Validation error',
        message: '有効なメールアドレスを入力してください' 
      });
    }

    // 名前の長さチェック（オプションフィールド）
    if (username && (username.length < 2 || username.length > 50)) {
      recordRegistrationAttempt(clientIp);
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'ユーザー名は2文字以上50文字以下である必要があります' 
      });
    }

    if (firstName && firstName.length > 50) {
      recordRegistrationAttempt(clientIp);
      return res.status(400).json({ 
        error: 'Validation error',
        message: '名前は50文字以下である必要があります' 
      });
    }

    if (lastName && lastName.length > 50) {
      recordRegistrationAttempt(clientIp);
      return res.status(400).json({ 
        error: 'Validation error',
        message: '姓は50文字以下である必要があります' 
      });
    }

    // パスワード強度チェック
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      recordRegistrationAttempt(clientIp);
      return res.status(400).json({ 
        error: 'Validation error',
        message: passwordErrors[0] // 最初のエラーメッセージを返す
      });
    }

    const sanitizedEmail = sanitizeEmail(email);

    // 既存ユーザーのチェック（データベース）
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
      select: { id: true, email: true }
    });
    
    if (existingUser) {
      recordRegistrationAttempt(clientIp);
      return res.status(400).json({ 
        error: 'User already exists',
        message: 'このメールアドレスは既に登録されています' 
      });
    }

    // ユーザー名の重複チェック（提供された場合）
    if (username) {
      const existingUsername = await prisma.user.findFirst({
        where: { username: sanitizeInput(username) },
        select: { id: true }
      });
      
      if (existingUsername) {
        recordRegistrationAttempt(clientIp);
        return res.status(400).json({ 
          error: 'Username already exists',
          message: 'このユーザー名は既に使用されています' 
        });
      }
    }

    // パスワードのハッシュ化（saltRounds増加）
    const hashedPassword = await hash(password, 12);

    // 新しいユーザーの作成（データベース）
    const newUser = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        password: hashedPassword,
        username: username ? sanitizeInput(username) : null,
        firstName: firstName ? sanitizeInput(firstName) : null,
        lastName: lastName ? sanitizeInput(lastName) : null,
        role: UserRole.STUDENT, // デフォルトロール
        isActive: true
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        createdAt: true,
        isActive: true
      }
    });

    // 成功時はレート制限をリセット
    registrationAttempts.delete(clientIp);

    // JWTトークンの生成
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email,
        role: newUser.role,
        iat: Math.floor(Date.now() / 1000)
      },
      jwtSecret,
      { 
        expiresIn: process.env.SESSION_TIMEOUT ? `${process.env.SESSION_TIMEOUT}s` : '7d',
        issuer: 'gyoseishoshi-learning',
        audience: 'gyoseishoshi-users'
      }
    );

    res.status(201).json({
      success: true,
      message: 'ユーザー登録が完了しました',
      user: newUser,
      token,
      expiresIn: process.env.SESSION_TIMEOUT ? `${process.env.SESSION_TIMEOUT}s` : '7d'
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // JWT_SECRET関連のエラーは別途処理
    if (error instanceof Error && error.message.includes('JWT_SECRET')) {
      return res.status(500).json({ 
        error: 'Configuration error',
        message: 'サーバー設定に問題があります。管理者にお問い合わせください' 
      });
    }

    // データベース固有のエラー処理
    if (error instanceof Error) {
      // Prisma固有のエラー
      if (error.message.includes('Unique constraint')) {
        return res.status(400).json({ 
          error: 'Duplicate entry',
          message: 'このメールアドレスまたはユーザー名は既に使用されています' 
        });
      }

      // データベース接続エラー
      if (error.message.includes('connect') ||
          error.message.includes('timeout') ||
          error.message.includes('database')) {
        console.error('Database connection error:', error.message);
        return res.status(503).json({ 
          error: 'Service unavailable',
          message: 'サービスが一時的に利用できません。しばらくしてから再試行してください' 
        });
      }
    }

    res.status(500).json({ 
      error: 'Internal server error',
      message: 'サーバーエラーが発生しました' 
    });
  }
}