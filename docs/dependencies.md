# Dependencies Documentation

プロジェクトで使用しているライブラリとその管理について説明します。

## Core Dependencies

### Next.js Framework
- **next**: 14.0.0
  - React based フルスタック Web フレームワーク
  - SSR/SSG サポート 
  - API Routes
  - 自動コード分割

### React Ecosystem
- **react**: 18.2.0
  - UI ライブラリ
  - コンポーネントベースアーキテクチャ
- **react-dom**: 18.2.0
  - React DOM レンダリング

### Styling
- **tailwindcss**: 3.3.0
  - ユーティリティファーストCSS フレームワーク
  - 高速な UI 開発
  - カスタマイズ可能なデザインシステム
- **autoprefixer**: 10.4.16
  - CSS の自動ベンダープレフィックス
- **postcss**: 8.4.31
  - CSS 変換ツール

### Icons
- **lucide-react**: 0.263.1
  - 美しいSVGアイコンライブラリ
  - Tree-shaking対応
  - TypeScript サポート

## Development Dependencies

### Build Tools
- **eslint**: 8.0.0
  - JavaScript/TypeScript Linter
  - コード品質の維持
- **eslint-config-next**: 14.0.0
  - Next.js 用 ESLint 設定

## Installation

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバーの起動
npm start

# Linting
npm run lint
```

## Package.json Scripts

- `dev`: 開発サーバーの起動 (localhost:3000)
- `build`: プロダクション用ビルド
- `start`: プロダクションサーバーの起動
- `lint`: ESLint によるコードチェック

## Version Management

### Node.js Version
- 推奨バージョン: 18.x以上
- `.nvmrc` ファイルでバージョン管理

### Package Lock
- `package-lock.json` でバージョン固定
- 一貫した依存関係の管理

## Dependency Updates

### 定期更新の手順
1. `npm outdated` で古い依存関係を確認
2. `npm update` で patch/minor バージョンを更新
3. メジャーバージョン更新は個別に検討
4. テストの実行とレビュー

### セキュリティ更新
- `npm audit` でセキュリティ問題を確認
- `npm audit fix` で自動修正
- 手動対応が必要な場合は個別に検討

## Bundle Analysis

### Bundle Analyzer の使用
```bash
# Bundle アナライザーの実行
npm run analyze
```

### パフォーマンス最適化
- Tree shaking の活用
- Code splitting の最適化
- 不要な依存関係の除去

## Environment Compatibility

### Browser Support
- ES2015+ (ES6+) 対応ブラウザ
- Internet Explorer: サポート外
- モダンブラウザ: Chrome, Firefox, Safari, Edge

### Node.js Compatibility
- Node.js 18.x 以上
- npm 8.x 以上

## Troubleshooting

### よくある問題

#### 依存関係のコンフリクト
```bash
# node_modules と package-lock.json を削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

#### Next.js キャッシュの問題
```bash
# Next.js キャッシュをクリア
npm run build -- --no-cache
# または
rm -rf .next
```

#### TypeScript エラー
```bash
# 型定義の再インストール
npm install @types/node @types/react @types/react-dom --save-dev
```

## Future Considerations

### 計画中の依存関係追加
- **@next/font**: フォント最適化
- **framer-motion**: アニメーション
- **react-query**: データフェッチング
- **zustand**: 状態管理

### 削除予定の依存関係
- 現在のところなし

---

最終更新: 2024年5月19日
