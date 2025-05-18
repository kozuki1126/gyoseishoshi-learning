# 🎓 行政書士試験対策ウェブサイト

[![Next.js](https://img.shields.io/badge/Next.js-14.x-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 概要

テキストと音声で効率的に学習できる行政書士試験対策サイトです。モダンなWebテクノロジーを使用し、インタラクティブな学習体験を提供します。

## ✨ 機能

### 🎯 学習機能
- **📚 単元ごとの学習テキスト**: Markdown形式での構造化されたコンテンツ
- **🎵 音声講義の再生**: 各単元に対応した音声コンテンツ
- **📄 PDFダウンロード**: 有料会員向けのオフライン学習サポート
- **📊 学習進捗管理**: 進捗トラッキングと可視化

### 🏗️ 管理機能
- **✏️ コンテンツ管理システム**: リアルタイムプレビュー付きエディタ
- **📁 ファイル管理**: PDF・音声ファイルのアップロード機能
- **🎨 アコーディオン形式の科目一覧**: 直感的なナビゲーション

### 💎 プレミアム機能
- **💳 有料会員機能**: Stripe統合による決済システム
- **⬇️ ダウンロード機能**: PDF・音声ファイルの一括取得
- **🏆 プログレストラッキング**: 詳細な学習分析

## 🛠️ 技術スタック

### フロントエンド
- **⚛️ React 18**: 最新のHooks APIを活用
- **⚡ Next.js 14**: App Routerによる高速ルーティング
- **🎨 Tailwind CSS**: ユーティリティファーストなスタイリング
- **📝 ReactMarkdown**: リアルタイムMarkdownプレビュー

### バックエンド
- **🟢 Node.js**: Next.js APIルートによるサーバーサイド処理
- **📁 Formidable**: 大容量ファイルアップロード対応
- **💾 ローカルファイルシステム**: シンプルで確実なデータ管理

### 開発環境
- **📦 npm**: パッケージ管理
- **🔧 PostCSS**: CSSの最適化
- **🏗️ 自動セットアップ**: 依存関係の自動初期化

## 🚀 インストールと実行

### 1. 必要な環境
- Node.js (バージョン14以上)
- npm または yarn

### 2. セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/kozuki1126/gyoseishoshi-learning.git
cd gyoseishoshi-learning

# 依存関係をインストール（自動セットアップ実行）
npm install

# 開発サーバーを起動
npm run dev
```

### 3. アクセス
ブラウザで [http://localhost:3000](http://localhost:3000) を開いてウェブサイトを表示

## 📁 プロジェクト構造

```
gyoseishoshi-learning/
├── 📄 README.md
├── 📦 package.json
├── ⚙️ next.config.js
├── 🎨 tailwind.config.js
├── 📁 src/
│   ├── 📁 components/     # Reactコンポーネント
│   ├── 📁 pages/         # Next.jsページ・APIルート
│   ├── 📁 data/          # データ管理
│   └── 📁 styles/        # スタイルシート
├── 📁 content/
│   └── 📁 units/         # 学習コンテンツ (.md)
└── 📁 public/
    ├── 📁 audio/         # 音声ファイル
    └── 📁 pdf/          # PDFファイル
```

## 🔧 主要機能の詳細

### コンテンツ管理システム
- **📝 Markdownエディタ**: シンタックスハイライト付き
- **👀 リアルタイムプレビュー**: 編集と同時に結果を確認
- **📄 テンプレート機能**: 一貫した構造でのコンテンツ作成
- **📂 ファイル管理**: ドラッグ&ドロップによる簡単アップロード

### API エンドポイント
- `GET/POST /api/content/get` - コンテンツの取得・保存
- `POST /api/content/upload` - ファイルアップロード
- `GET /api/content/get-files` - ファイル情報の取得

## 🎯 学習範囲

### 📚 対象科目 (8科目)
1. **民法** - 権利の主体、物権、債権など (10単元)
2. **憲法** - 基本的人権、統治機構など (10単元)
3. **行政法** - 一般的な法理論 (10単元)
4. **行政手続法等** - 手続法、不服審査法など (10単元)
5. **地方自治法** - 地方公共団体の組織・権能 (10単元)
6. **会社法等** - 法人制度、株式会社法 (10単元)
7. **個別行政法** - 業務関連法令 (10単元)
8. **情報通信** - インターネット・法令用語 (10単元)

**📋 総計: 8科目 80単元**

## 🔒 セキュリティ

- ✅ ファイルサイズ制限 (10MB)
- ✅ 許可ファイル形式の制限
- ✅ パストラバーサル攻撃の防止
- ✅ 適切なエラーハンドリング

## 🤝 貢献

プロジェクトへの貢献を歓迎します！

1. リポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

## 📜 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルをご覧ください。

## 🔗 関連リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Markdown](https://github.com/remarkjs/react-markdown)

## 👨‍💻 開発者

🤖 **Generated with [Claude Code](https://claude.ai/code)**

---

### 🎯 プロジェクトステータス

- ✅ **コア機能実装完了** - コンテンツ管理・ファイル機能
- ✅ **UI/UX設計完了** - モダンで直感的なインターフェース
- 🚧 **認証システム** - 開発予定
- 🚧 **決済システム** - 開発予定
- 🚧 **モバイル最適化** - 開発予定

*行政書士試験合格を目指すすべての受験生のために* 📚✨