import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// JWT設定
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// パスワードのハッシュ化
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

// パスワードの検証
export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

// JWTトークンの生成
export function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    isPremium: user.isPremium || false
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// JWTトークンの検証
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// リクエストからトークンを抽出
export function getTokenFromRequest(req) {
  // Authorization ヘッダーから取得
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Cookieから取得
  const cookies = req.cookies;
  if (cookies && cookies.token) {
    return cookies.token;
  }

  return null;
}

// 認証ミドルウェア
export function withAuth(handler) {
  return async (req, res) => {
    const token = getTokenFromRequest(req);
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: '認証が必要です' 
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        error: 'トークンが無効または期限切れです' 
      });
    }

    // リクエストにユーザー情報を追加
    req.user = decoded;
    
    return handler(req, res);
  };
}

// プレミアムユーザー限定ミドルウェア
export function withPremium(handler) {
  return withAuth(async (req, res) => {
    if (!req.user.isPremium) {
      return res.status(403).json({ 
        success: false, 
        error: 'プレミアム会員限定の機能です' 
      });
    }
    
    return handler(req, res);
  });
}

// Cookie設定のヘルパー
export function setAuthCookie(res, token) {
  // HttpOnly Cookie として設定
  res.setHeader('Set-Cookie', [
    `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
  ]);
}

// Cookie削除のヘルパー
export function clearAuthCookie(res) {
  res.setHeader('Set-Cookie', [
    'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax'
  ]);
}
