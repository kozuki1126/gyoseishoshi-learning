import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// JWTトークンの検証ミドルウェア
function verifyToken(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    throw new Error('認証トークンが必要です');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return decoded;
  } catch (error) {
    throw new Error('無効な認証トークンです');
  }
}

export default async function handler(req, res) {
  try {
    // トークンの検証
    const user = verifyToken(req);

    if (req.method === 'GET') {
      // 進捗データの取得
      const usersData = await fs.readFile(USERS_FILE, 'utf8');
      const users = JSON.parse(usersData);
      
      const currentUser = users.find(u => u.id === user.userId);
      if (!currentUser) {
        return res.status(404).json({ message: 'ユーザーが見つかりません' });
      }

      res.status(200).json({
        progress: currentUser.progress || {},
        overall: calculateOverallProgress(currentUser.progress || {})
      });

    } else if (req.method === 'POST') {
      // 進捗データの更新
      const { unitId, completed, score, timeSpent } = req.body;

      if (!unitId) {
        return res.status(400).json({ message: 'ユニットIDが必要です' });
      }

      const usersData = await fs.readFile(USERS_FILE, 'utf8');
      const users = JSON.parse(usersData);
      
      const userIndex = users.findIndex(u => u.id === user.userId);
      if (userIndex === -1) {
        return res.status(404).json({ message: 'ユーザーが見つかりません' });
      }

      // 進捗データの更新
      if (!users[userIndex].progress) {
        users[userIndex].progress = {};
      }

      users[userIndex].progress[unitId] = {
        completed: completed || false,
        score: typeof score === 'number' ? score : null,
        timeSpent: timeSpent || 0,
        lastAccessed: new Date().toISOString(),
        ...(users[userIndex].progress[unitId] || {})
      };

      // ファイルに保存
      await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));

      res.status(200).json({
        message: '進捗が更新されました',
        progress: users[userIndex].progress[unitId],
        overall: calculateOverallProgress(users[userIndex].progress)
      });

    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Progress API error:', error);
    
    if (error.message.includes('認証') || error.message.includes('無効')) {
      return res.status(401).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
}

// 全体の進捗を計算する関数
function calculateOverallProgress(progress) {
  const entries = Object.entries(progress);
  if (entries.length === 0) {
    return {
      totalUnits: 0,
      completedUnits: 0,
      completionRate: 0,
      averageScore: 0,
      totalTimeSpent: 0
    };
  }

  const completedUnits = entries.filter(([_, data]) => data.completed).length;
  const scores = entries.map(([_, data]) => data.score).filter(score => score !== null);
  const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const totalTimeSpent = entries.reduce((total, [_, data]) => total + (data.timeSpent || 0), 0);

  return {
    totalUnits: entries.length,
    completedUnits,
    completionRate: Math.round((completedUnits / entries.length) * 100),
    averageScore: Math.round(averageScore),
    totalTimeSpent
  };
}
