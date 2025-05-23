import { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// ユーザーデータファイルの初期化
async function initializeUsersFile() {
  try {
    await fs.access(USERS_FILE);
  } catch {
    // ファイルが存在しない場合は作成
    await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
    await fs.writeFile(USERS_FILE, JSON.stringify([]));
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;

    // 入力検証
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'すべてのフィールドを入力してください' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'パスワードは6文字以上である必要があります' });
    }

    // ユーザーファイルの初期化
    await initializeUsersFile();

    // 既存ユーザーのチェック
    const usersData = await fs.readFile(USERS_FILE, 'utf8');
    const users = JSON.parse(usersData);

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'このメールアドレスは既に登録されています' });
    }

    // パスワードのハッシュ化
    const hashedPassword = await hash(password, 12);

    // 新しいユーザーの作成
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      isPremium: false,
      progress: {}
    };

    users.push(newUser);
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));

    // JWTトークンの生成
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // パスワードを除外してレスポンス
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'ユーザー登録が完了しました',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
}
