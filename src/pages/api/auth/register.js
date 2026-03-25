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
    const { email, password, name } = req.body;

    // バリデーション
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'メールアドレス、パスワード、名前は必須です'
      });
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: '有効なメールアドレスを入力してください'
      });
    }

    // パスワードの長さチェック
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'パスワードは8文字以上で設定してください'
      });
    }

    // 名前の長さチェック
    if (name.length < 1 || name.length > 50) {
      return res.status(400).json({
        success: false,
        error: '名前は1〜50文字で入力してください'
      });
    }

    // ユーザー作成
    const user = await userManager.create({
      email: email.toLowerCase().trim(),
      password,
      name: name.trim()
    });

    // トークン生成
    const token = generateToken(user);

    // Cookieにトークンを設定
    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: 'ユーザー登録が完了しました',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isPremium: user.isPremium
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);

    // 重複エラーの場合
    if (error.message.includes('既に登録')) {
      return res.status(409).json({
        success: false,
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      error: 'ユーザー登録に失敗しました'
    });
  }
}
