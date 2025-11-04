# 開発コマンド・ワークフロー

## 現在利用可能なコマンド
```bash
# 開発
npm run dev          # 開発サーバー起動（localhost:3000）
npm run build        # プロダクションビルド
npm run start        # プロダクションサーバー起動
npm run lint         # ESLint実行

# セットアップ
npm install          # 依存関係インストール + 自動セットアップ
npm run setup        # 手動セットアップ実行
```

## Phase 2 で追加予定のコマンド
```bash
# データベース操作
npm run db:migrate   # Prisma マイグレーション実行
npm run db:seed      # 初期データ投入
npm run db:studio    # Prisma Studio 起動
npm run db:generate  # Prisma Client 生成

# TypeScript
npm run type-check   # TypeScript 型チェック

# テスト（計画中）
npm test            # Jest テスト実行
npm run test:watch  # テスト監視モード
```

## 開発ワークフロー
1. **機能開発**: feature/ ブランチで開発
2. **コミット**: 意味のあるコミットメッセージ
3. **PR作成**: レビュー後マージ
4. **デプロイ**: main ブランチから自動デプロイ（計画中）

## 重要なファイル
- `next.config.js` - Next.js 設定
- `tailwind.config.js` - Tailwind CSS 設定
- `.env.example` - 環境変数テンプレート
- `setup.js` - 初期セットアップスクリプト