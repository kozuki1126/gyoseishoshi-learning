import userManager from '@/features/auth/server/userManager';
import progressRepository from '@/server/repositories/progressRepository';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const users = await userManager.listUsers();
    const rows = users.map((user) => {
      const summary = progressRepository.getSummary(user.id);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        status: user.status || 'active',
        membership: user.membership || 'free',
        isPremium: Boolean(user.isPremium),
        progress: summary.overall.completionRate,
        completedUnits: summary.overall.completedUnits,
        totalTrackedUnits: summary.overall.totalUnits,
        totalTimeSpent: summary.overall.totalTimeSpent,
        averageScore: summary.overall.averageScore,
        lastLogin: user.lastLoginAt || null,
        registeredAt: user.createdAt,
      };
    });

    return res.status(200).json({
      success: true,
      users: rows,
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return res.status(500).json({
      success: false,
      error: 'ユーザー一覧の取得に失敗しました',
    });
  }
}
