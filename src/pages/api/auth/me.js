import userManager from '@/features/auth/server/userManager';
import { withAuth } from '@/features/auth/server/auth';

async function handler(req, res) {
  // GETメソッドのみ許可
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    // req.user は withAuth ミドルウェアによって設定される
    const userId = req.user.userId;

    // ユーザー情報を取得
    const user = await userManager.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'ユーザーが見つかりません'
      });
    }

    // プレミアムステータスのチェック
    await userManager.checkPremiumStatus(userId);

    // 全体の進捗統計を取得
    const overallProgress = await userManager.getOverallProgress(userId);

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isPremium: user.isPremium,
        premiumExpiresAt: user.premiumExpiresAt,
        settings: user.settings,
        createdAt: user.createdAt
      },
      progress: overallProgress
    });

  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      error: 'ユーザー情報の取得に失敗しました'
    });
  }
}

// 認証ミドルウェアを適用
export default withAuth(handler);
