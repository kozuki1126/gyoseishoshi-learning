import fs from 'fs';
import path from 'path';
import { hashPassword, verifyPassword } from './auth';

// ユーザーデータファイルのパス
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// データディレクトリの初期化
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }
}

// ユーザーデータの読み込み
function loadUsers() {
  ensureDataDir();
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  return JSON.parse(data);
}

// ユーザーデータの保存
function saveUsers(users) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

class UserManager {
  // メールでユーザーを検索
  async findByEmail(email) {
    const users = loadUsers();
    return users.find(u => u.email === email) || null;
  }

  // IDでユーザーを検索
  async findById(id) {
    const users = loadUsers();
    return users.find(u => u.id === id) || null;
  }

  // 新規ユーザーの作成
  async create(userData) {
    const users = loadUsers();
    
    // メールの重複チェック
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('このメールアドレスは既に登録されています');
    }

    // パスワードのハッシュ化
    const hashedPassword = await hashPassword(userData.password);

    // 新規ユーザーの作成
    const newUser = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPremium: false,
      premiumExpiresAt: null,
      progress: {},
      settings: {
        emailNotifications: true,
        darkMode: false
      }
    };

    users.push(newUser);
    saveUsers(users);

    // パスワードを除いたユーザー情報を返す
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // ログイン認証
  async authenticate(email, password) {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return null;
    }

    // パスワードを除いたユーザー情報を返す
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // ユーザー情報の更新
  async update(id, updates) {
    const users = loadUsers();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      throw new Error('ユーザーが見つかりません');
    }

    // パスワードの更新がある場合はハッシュ化
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    saveUsers(users);

    const { password, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  }

  // 学習進捗の取得
  async getProgress(userId) {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }
    return user.progress || {};
  }

  // 学習進捗の更新
  async updateProgress(userId, unitId, progressData) {
    const users = loadUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('ユーザーが見つかりません');
    }

    if (!users[userIndex].progress) {
      users[userIndex].progress = {};
    }

    users[userIndex].progress[unitId] = {
      ...users[userIndex].progress[unitId],
      ...progressData,
      lastAccessed: new Date().toISOString()
    };

    users[userIndex].updatedAt = new Date().toISOString();
    saveUsers(users);

    return users[userIndex].progress;
  }

  // 全体の進捗統計を取得
  async getOverallProgress(userId) {
    const progress = await this.getProgress(userId);
    const unitIds = Object.keys(progress);
    
    const stats = {
      totalUnits: unitIds.length,
      completedUnits: unitIds.filter(id => progress[id].completed).length,
      averageScore: 0,
      totalTimeSpent: 0
    };

    if (unitIds.length > 0) {
      const scores = unitIds
        .filter(id => progress[id].score !== undefined)
        .map(id => progress[id].score);
      
      if (scores.length > 0) {
        stats.averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      }

      stats.totalTimeSpent = unitIds.reduce((total, id) => {
        return total + (progress[id].timeSpent || 0);
      }, 0);
    }

    stats.completionRate = stats.totalUnits > 0 
      ? Math.round((stats.completedUnits / stats.totalUnits) * 100) 
      : 0;

    return stats;
  }

  // プレミアム会員への昇格
  async upgradeToPremium(userId, expiresAt) {
    return this.update(userId, {
      isPremium: true,
      premiumExpiresAt: expiresAt
    });
  }

  // プレミアム会員の期限切れチェック
  async checkPremiumStatus(userId) {
    const user = await this.findById(userId);
    if (!user) return false;

    if (!user.isPremium) return false;

    if (user.premiumExpiresAt) {
      const expiresAt = new Date(user.premiumExpiresAt);
      if (expiresAt < new Date()) {
        // 期限切れの場合、ステータスを更新
        await this.update(userId, {
          isPremium: false,
          premiumExpiresAt: null
        });
        return false;
      }
    }

    return true;
  }
}

// シングルトンインスタンス
const userManager = new UserManager();
export default userManager;
