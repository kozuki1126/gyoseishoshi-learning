# 🚀 セットアップガイド - 認証機能付き

このガイドでは、認証機能が追加された行政書士試験対策サイトのセットアップ方法を説明します。

## 📋 必要な環境

- **Node.js**: 18.x 以上
- **npm**: 8.x 以上
- **Git**: 2.x 以上

## 🛠️ インストール手順

### 1. リポジトリのクローン
```bash
git clone https://github.com/kozuki1126/gyoseishoshi-learning.git
cd gyoseishoshi-learning
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 環境変数の設定
```bash
# 環境変数ファイルをコピー
cp .env.example .env.local

# エディタで編集
nano .env.local
```

**重要:** `.env.local` ファイルで以下の設定を行ってください：
```bash
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. 開発サーバーの起動
```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 🔐 新機能：認証システム

### ユーザー登録
- **エンドポイント**: `POST /api/auth/register`
- **必要フィールド**: email, password, name
- **レスポンス**: JWT トークン + ユーザー情報

**使用例:**
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword',
    name: '山田太郎'
  })
});

const data = await response.json();
console.log('登録成功:', data.user);
console.log('トークン:', data.token);
```

### ユーザーログイン
- **エンドポイント**: `POST /api/auth/login`
- **必要フィールド**: email, password
- **レスポンス**: JWT トークン + ユーザー情報

**使用例:**
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword'
  })
});

const data = await response.json();
localStorage.setItem('token', data.token);
```

### 進捗トラッキング
- **取得**: `GET /api/user/progress`
- **更新**: `POST /api/user/progress`
- **認証**: Bearer トークンが必要

**使用例:**
```javascript
// 進捗の取得
const token = localStorage.getItem('token');
const response = await fetch('/api/user/progress', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// 進捗の更新
await fetch('/api/user/progress', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    unitId: 'constitutional-law-001',
    completed: true,
    score: 85,
    timeSpent: 1800 // 秒
  })
});
```

## 📚 コンテンツ管理

### サンプルコンテンツ
憲法の第1章のサンプルコンテンツが `content/units/constitutional-law-001.md` に追加されています。

### 新しいコンテンツの追加
1. `content/units/` ディレクトリに Markdown ファイルを作成
2. ファイル名は `{subject}-{number}.md` の形式
3. 管理画面 `/admin/content` でアップロード・編集可能

## 🔧 開発者向け情報

### ユーザーデータ
ユーザー情報は `data/users.json` に保存されます：
```json
[
  {
    "id": "1640995200000",
    "email": "user@example.com",
    "name": "山田太郎",
    "password": "hashed_password",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "isPremium": false,
    "progress": {
      "constitutional-law-001": {
        "completed": true,
        "score": 85,
        "timeSpent": 1800,
        "lastAccessed": "2024-01-01T01:00:00.000Z"
      }
    }
  }
]
```

### API エンドポイント一覧
| エンドポイント | メソッド | 認証 | 説明 |
|---|---|---|---|
| `/api/auth/register` | POST | 不要 | ユーザー登録 |
| `/api/auth/login` | POST | 不要 | ログイン |
| `/api/user/progress` | GET | 必要 | 進捗取得 |
| `/api/user/progress` | POST | 必要 | 進捗更新 |
| `/api/content/[action]` | GET/POST | 部分的 | コンテンツ管理 |

### 進捗データ構造
```javascript
{
  progress: {
    "unit-id": {
      completed: boolean,
      score: number | null,
      timeSpent: number, // 秒
      lastAccessed: string // ISO date
    }
  },
  overall: {
    totalUnits: number,
    completedUnits: number,
    completionRate: number, // パーセント
    averageScore: number,
    totalTimeSpent: number // 秒
  }
}
```

## 🎯 次のステップ

### 優先度 High
1. **フロントエンド認証統合**
   - ログイン/登録フォームとAPIの接続
   - JWTトークンの管理
   - 認証状態の管理

2. **コンテンツの追加**
   - 残り79ユニットのコンテンツ作成
   - 音声ファイルの追加
   - PDFファイルの追加

### 優先度 Medium
1. **クイズ機能**
   - 練習問題システム
   - 自動採点機能
   - 結果の保存

2. **学習プラン機能**
   - カスタマイズ可能な学習スケジュール
   - 進捗に基づく推奨コンテンツ

### 優先度 Low
1. **決済システム**
   - Stripe統合
   - プレミアム機能のアクセス制御

2. **ソーシャル機能**
   - 学習グループ
   - 進捗共有

## 🐛 トラブルシューティング

### よくある問題

**1. npm install でエラーが発生する**
```bash
# Node.jsのバージョンを確認
node --version

# npmをアップデート
npm install -g npm@latest

# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

**2. JWT_SECRET エラー**
- `.env.local` ファイルが正しく作成されているか確認
- 環境変数が正しく設定されているか確認

**3. ユーザー登録できない**
- `data` ディレクトリの書き込み権限を確認
- サーバーを再起動してみる

## 📞 サポート

問題が解決しない場合は、以下で報告してください：
- **GitHub Issues**: https://github.com/kozuki1126/gyoseishoshi-learning/issues
- **メール**: keisuke.kozuki@gmail.com

---

🎓 **行政書士試験合格を目指してがんばってください！**
