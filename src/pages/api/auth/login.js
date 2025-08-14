import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// JWT秘密キーの検証
function getJwtSecret() {
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
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().toLowerCase();
}

// レート制限（シンプルな実装）
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15分

function checkRateLimit(email) {
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

function recordFailedAttempt(email) {
  const now = Date.now();
  const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
  loginAttempts.set(email, { 
    count: attempts.count + 1, 
    lastAttempt: now 
  });
}

export default async function handler(req, res) {
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
    // JWT秘密キーの存在確認（起動時チェック）
    const jwtSecret = getJwtSecret();

    const { email, password } = req.body;

    // 入力検証の強化
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'メールアドレスとパスワードを入力してください' 
      });
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
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

    const sanitizedEmail = sanitizeInput(email);

    // レート制限チェック
    if (!checkRateLimit(sanitizedEmail)) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded',
        message: 'ログイン試行回数が上限に達しました。15分後に再試行してください' 
      });
    }

    // ユーザーデータの読み込み
    try {
      const usersData = await fs.readFile(USERS_FILE, 'utf8');
      const users = JSON.parse(usersData);

      // ユーザーの検索
      const user = users.find(u => sanitizeInput(u.email) === sanitizedEmail);
      if (!user) {
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

      // JWTトークンの生成（安全な秘密キーを使用）
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          iat: Math.floor(Date.now() / 1000)
        },
        jwtSecret,
        { 
          expiresIn: '7d',
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
        expiresIn: '7d'
      });

    } catch (fileError) {
      console.error('User file read error:', fileError);
      // セキュリティのため、具体的なエラー内容は返さない
      return res.status(401).json({ 
        error: 'Authentication failed',
        message: 'メールアドレスまたはパスワードが正しくありません' 
      });
    }

  } catch (error) {
    console.error('Login error:', error);
    
    // JWT_SECRET関連のエラーは別途処理
    if (error.message.includes('JWT_SECRET')) {
      return res.status(500).json({ 
        error: 'Configuration error',
        message: 'サーバー設定に問題があります。管理者にお問い合わせください' 
      });
    }

    res.status(500).json({ 
      error: 'Internal server error',
      message: 'サーバーエラーが発生しました' 
    });
  }
}
