import userManager from '@/features/auth/server/userManager';
import { withAuth } from '@/features/auth/server/auth';

async function handler(req, res) {
  const userId = req.user.userId;

  switch (req.method) {
    case 'GET':
      return handleGet(req, res, userId);
    case 'PUT':
      return handlePut(req, res, userId);
    default:
      return res.status(405).json({ 
        success: false, 
        error: 'Method not allowed' 
      });
  }
}

// プロフィール取得
async function handleGet(req, res, userId) {
  try {
    const user = await userManager.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'ユーザーが見つかりません'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isPremium: user.isPremium,
        membership: user.membership,
        premiumExpiresAt: user.premiumExpiresAt,
        settings: user.settings,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      error: 'プロフィールの取得に失敗しました'
    });
  }
}

// プロフィール更新
async function handlePut(req, res, userId) {
  try {
    const { name, settings, currentPassword, newPassword } = req.body;
    const updates = {};

    // 名前の更新
    if (name !== undefined) {
      if (name.length < 1 || name.length > 50) {
        return res.status(400).json({
          success: false,
          error: '名前は1〜50文字で入力してください'
        });
      }
      updates.name = name.trim();
    }

    // 設定の更新
    if (settings !== undefined) {
      const user = await userManager.findById(userId);
      updates.settings = {
        ...user.settings,
        ...settings
      };
    }

    // パスワードの更新
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          error: '現在のパスワードを入力してください'
        });
      }

      // 現在のパスワードを確認
      const user = await userManager.findById(userId);
      const authenticated = await userManager.authenticate(user.email, currentPassword);
      
      if (!authenticated) {
        return res.status(400).json({
          success: false,
          error: '現在のパスワードが正しくありません'
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          error: '新しいパスワードは8文字以上で設定してください'
        });
      }

      updates.password = newPassword;
    }

    // 更新がない場合
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: '更新する内容がありません'
      });
    }

    // プロフィールの更新
    const updatedUser = await userManager.update(userId, updates);

    return res.status(200).json({
      success: true,
      message: 'プロフィールを更新しました',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        isPremium: updatedUser.isPremium,
        membership: updatedUser.membership,
        settings: updatedUser.settings
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      error: 'プロフィールの更新に失敗しました'
    });
  }
}

// 認証ミドルウェアを適用
export default withAuth(handler);
