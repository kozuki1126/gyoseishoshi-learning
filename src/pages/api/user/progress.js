import userManager from '@/features/auth/server/userManager';
import { withAuth } from '@/features/auth/server/auth';

async function handler(req, res) {
  const userId = req.user.userId;

  switch (req.method) {
    case 'GET':
      return handleGet(req, res, userId);
    case 'POST':
      return handlePost(req, res, userId);
    default:
      return res.status(405).json({ 
        success: false, 
        error: 'Method not allowed' 
      });
  }
}

// 進捗取得
async function handleGet(req, res, userId) {
  try {
    const { unitId } = req.query;

    // 特定の単元の進捗を取得
    if (unitId) {
      const progress = await userManager.getProgress(userId);
      return res.status(200).json({
        success: true,
        progress: progress[unitId] || null
      });
    }

    // 全体の進捗を取得
    const progress = await userManager.getProgress(userId);
    const overallProgress = await userManager.getOverallProgress(userId);

    return res.status(200).json({
      success: true,
      progress,
      overall: overallProgress
    });

  } catch (error) {
    console.error('Get progress error:', error);
    return res.status(500).json({
      success: false,
      error: '進捗の取得に失敗しました'
    });
  }
}

// 進捗更新
async function handlePost(req, res, userId) {
  try {
    const { unitId, completed, score, timeSpent, currentPosition } = req.body;

    // バリデーション
    if (!unitId) {
      return res.status(400).json({
        success: false,
        error: '単元IDは必須です'
      });
    }

    // 進捗データの構築
    const progressData = {};

    if (completed !== undefined) {
      progressData.completed = Boolean(completed);
      if (completed) {
        progressData.completedAt = new Date().toISOString();
      }
    }

    if (score !== undefined) {
      const numScore = Number(score);
      if (isNaN(numScore) || numScore < 0 || numScore > 100) {
        return res.status(400).json({
          success: false,
          error: 'スコアは0〜100の数値で入力してください'
        });
      }
      progressData.score = numScore;
    }

    if (timeSpent !== undefined) {
      const numTimeSpent = Number(timeSpent);
      if (isNaN(numTimeSpent) || numTimeSpent < 0) {
        return res.status(400).json({
          success: false,
          error: '学習時間は0以上の数値で入力してください'
        });
      }
      progressData.timeSpent = numTimeSpent;
    }

    if (currentPosition !== undefined) {
      progressData.currentPosition = currentPosition;
    }

    // 進捗の更新
    const updatedProgress = await userManager.updateProgress(userId, unitId, progressData);

    return res.status(200).json({
      success: true,
      message: '進捗を更新しました',
      progress: updatedProgress[unitId]
    });

  } catch (error) {
    console.error('Update progress error:', error);
    return res.status(500).json({
      success: false,
      error: '進捗の更新に失敗しました'
    });
  }
}

// 認証ミドルウェアを適用
export default withAuth(handler);
