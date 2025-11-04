# プロジェクト概要・技術スタック

## プロジェクト概要
**プロジェクト名**: 行政書士試験対策ウェブサイト  
**リポジトリ**: https://github.com/kozuki1126/gyoseishoshi-learning  
**目的**: テキストと音声で効率的に学習できる行政書士試験対策サイト

## 技術スタック（現在）
- **フロントエンド**: React 18 + Next.js 14.2.28 + Tailwind CSS 3.3.5
- **認証**: bcryptjs 2.4.3 + jsonwebtoken 9.0.2
- **ファイル処理**: formidable 3.5.4
- **データ管理**: JSONファイル + メモリベース（ContentManager）
- **コンテンツ**: Markdown（react-markdown 9.0.0）
- **開発ツール**: PostCSS + Autoprefixer

## Phase 2 移行計画中の技術スタック
- **データベース**: PostgreSQL + Prisma ORM 5.15.1
- **型安全性**: TypeScript 5.5.3
- **テスト**: Jest + React Testing Library（計画中）