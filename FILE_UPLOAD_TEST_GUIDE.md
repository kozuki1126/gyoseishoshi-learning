# 行政書士試験対策サイト - File Upload/Download機能テストガイド 📚

## 🚀 セットアップ手順

### 1. リポジトリのクローン
```bash
git clone https://github.com/kozuki1126/gyoseishoshi-learning.git
cd gyoseishoshi-learning
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 開発サーバーの起動
```bash
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

## 📋 ファイルアップロード・ダウンロード機能のテスト

### テスト手順

1. **ユニットページへのアクセス**
   - ホームページから任意の科目を選択
   - ユニット一覧から任意のユニットを選択
   - または直接 http://localhost:3000/units/101 にアクセス

2. **ファイルアップロードのテスト**
   - 右サイドバーの「学習資料」セクションを確認
   - 「アップロード」ボタンをクリック
   - モーダルが開くので、以下のファイルをアップロード：
     - PDFファイル（学習資料として）
     - 音声ファイル（MP3、WAV、M4Aなど）
   - アップロード完了後、ファイルマネージャーに反映されることを確認

3. **ファイルダウンロードのテスト**
   - アップロードしたファイルの横にあるダウンロードボタンをクリック
   - PDFファイルの場合は、外部リンクボタンで新しいタブで開けることも確認
   - 「データエクスポート」セクションから：
     - 進捗データ（JSON形式）のダウンロード
     - 学習ノート（テキスト形式）のダウンロード

### 📁 ディレクトリ構造

セットアップ後、以下のディレクトリが自動作成されます：

```
gyoseishoshi-learning/
├── content/
│   └── units/         # ユニットコンテンツとメタデータ
├── public/
│   ├── audio/         # アップロードされた音声ファイル
│   └── pdf/           # アップロードされたPDFファイル
└── temp/              # 一時ファイル保存用
```

## 🔧 トラブルシューティング

### アップロードが失敗する場合

1. **formidableパッケージの確認**
   ```bash
   npm list formidable
   ```

2. **ディレクトリの権限確認**
   - `public/audio`、`public/pdf`、`temp`ディレクトリへの書き込み権限を確認

3. **エラーログの確認**
   - ブラウザの開発者ツールでコンソールエラーを確認
   - サーバーコンソールでエラーメッセージを確認

### ファイルが表示されない場合

1. **APIエンドポイントの確認**
   - `/api/content/get-files?unitId=101` が正しく動作しているか確認

2. **メタデータファイルの確認**
   - `content/units/[unitId].meta.json` ファイルが作成されているか確認

## 📝 注意事項

- アップロード可能なファイルサイズは最大10MBです
- 対応フォーマット：
  - PDF: `.pdf`
  - 音声: `.mp3`, `.wav`, `.m4a`, `.ogg`
- 開発環境では、アップロードしたファイルは `public` ディレクトリに保存されます
- 本番環境では、適切なストレージサービス（AWS S3など）を使用することを推奨します

## 🎯 次のステップ

- [ ] エラーハンドリングの改善
- [ ] プログレスバーのリアルタイム更新
- [ ] ファイル削除機能の実装
- [ ] 複数ファイル同時アップロード
- [ ] クラウドストレージ統合（本番環境用）

## 🤝 サポート

問題が発生した場合は、GitHubのIssuesで報告してください。

---

Happy Learning! 📖✨
