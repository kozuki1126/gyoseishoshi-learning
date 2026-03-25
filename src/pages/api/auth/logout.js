import { clearAuthCookie } from '@/features/auth/server/auth';

export default async function handler(req, res) {
  // POSTメソッドのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    // Cookieからトークンを削除
    clearAuthCookie(res);

    return res.status(200).json({
      success: true,
      message: 'ログアウトしました'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      error: 'ログアウトに失敗しました'
    });
  }
}
