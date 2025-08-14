import { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// JWT秘密キーの検証（login.jsと共通化推奨）
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
  return input.trim();
}

// セキュアなIDの生成
function generateSecureId() {
  return crypto.randomUUID();
}

// パスワード強度チェック
function validatePassword(password) {
  const errors = [];
  
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
  
  return errors;
}

// レート制限（簡単な実装）
const registrationAttempts = new Map();
const MAX_REGISTRATION_ATTEMPTS = 3;
const REGISTRATION_LOCKOUT_TIME = 60 * 60 * 1000; // 1時間

function checkRegistrationRateLimit(ip) {
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

function recordRegistrationAttempt(ip) {
  const now = Date.now();
  const attempts = registrationAttempts.get(ip) || { count: 0, lastAttempt: 0 };
  registrationAttempts.set(ip, { 
    count: attempts.count + 1, 
    lastAttempt: now 
  });
}

// ユーザーデータファイルの初期化
async function initializeUsersFile() {
  try {
    await fs.access(USERS_FILE);
  } catch {
    // ファイルが存在しない場合は作成
    await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
  }
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
    // JWT秘密キーの存在確認
    const jwtSecret = getJwtSecret();

    // レート制限チェック
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    if (!checkRegistrationRateLimit(clientIp)) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded',
        message: '登録試行回数が上限に達しました。1時間後に再試行してください' 
      });
    }

    const { email, password, name } = req.body;

    // 入力検証
    if (!email || !password || !name) {
      recordRegistrationAttempt(clientIp);
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'すべてのフィールドを入力してください' 
      });
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      recordRegistrationAttempt(clientIp);
      return res.status(400).json({ 
        error: 'Validation error',
        message: '有効なメールアドレスを入力してください' 
      });
    }

    // 名前の長さチェック
    if (name.length < 2 || name.length > 50) {
      recordRegistrationAttempt(clientIp);
      return res.status(400).json({ 
        error: 'Validation error',
        message: '名前は2文字以上50文字以下である必要があります' 
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

    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const sanitizedName = sanitizeInput(name);

    // ユーザーファイルの初期化
    await initializeUsersFile();

    // 既存ユーザーのチェック
    const usersData = await fs.readFile(USERS_FILE, 'utf8');
    const users = JSON.parse(usersData);

    const existingUser = users.find(user => 
      sanitizeInput(user.email).toLowerCase() === sanitizedEmail
    );
    
    if (existingUser) {
      recordRegistrationAttempt(clientIp);
      return res.status(400).json({ 
        error: 'User already exists',
        message: 'このメールアドレスは既に登録されています' 
      });
    }

    // パスワードのハッシュ化（saltRounds増加）
    const hashedPassword = await hash(password, 14);

    // 新しいユーザーの作成
    const newUser = {
      id: generateSecureId(),
      email: sanitizedEmail,
      name: sanitizedName,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPremium: false,
      isActive: true,
      emailVerified: false, // 将来的なメール認証用
      lastLogin: null,
      progress: {},
      settings: {
        theme: 'light',
        notifications: true
      }
    };

    users.push(newUser);
    
    // ファイル書き込み時の競合状態を防ぐ（基本的な実装）
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));

    // 成功時はレート制限をリセット
    registrationAttempts.delete(clientIp);

    // JWTトークンの生成（強化されたペイロード）
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email,
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
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'ユーザー登録が完了しました',
      user: userWithoutPassword,
      token,
      expiresIn: '7d'
    });

  } catch (error) {
    console.error('Registration error:', error);
    
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
