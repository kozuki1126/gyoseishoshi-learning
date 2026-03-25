import userManager from '@/features/auth/server/userManager';
import { generateToken, setAuthCookie } from '@/features/auth/server/auth';

export default async function handler(req, res) {
  // POSTメソッドのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { email, password } = req.body;

    // バリデーション
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'メールアドレスとパスワードを入力してください'
      });
    }

    // 認証
    const user = await userManager.authenticate(
      email.toLowerCase().trim(),
      password
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'メールアドレスまたはパスワードが正しくありません'
      });
    }

    // プレミアムステータスのチェック
    await userManager.checkPremiumStatus(user.id);

    // トークン生成
    const token = generateToken(user);

    // Cookieにトークンを設定
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'ログインしました',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isPremium: user.isPremium
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'ログインに失敗しました'
    });
  }
}
