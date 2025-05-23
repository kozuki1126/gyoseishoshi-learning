import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // 入力検証
    if (!email || !password) {
      return res.status(400).json({ message: 'メールアドレスとパスワードを入力してください' });
    }

    // ユーザーデータの読み込み
    try {
      const usersData = await fs.readFile(USERS_FILE, 'utf8');
      const users = JSON.parse(usersData);

      // ユーザーの検索
      const user = users.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
      }

      // パスワードの検証
      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
      }

      // JWTトークンの生成
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      // パスワードを除外してレスポンス
      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json({
        message: 'ログインに成功しました',
        user: userWithoutPassword,
        token
      });

    } catch (fileError) {
      // ユーザーファイルが存在しない場合
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
}
