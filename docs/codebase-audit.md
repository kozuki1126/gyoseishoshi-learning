# Codebase Audit

最終更新: 2026-03-25

## 概要

このリポジトリは Next.js 14 の `pages` ルーター構成で、学習導線、認証、マイページ、管理画面、簡易 CMS、セキュリティ補助コードが同居しています。今回の整理では、ルーティングは維持したまま実装本体を責務単位に再配置しました。

## 現在の責務分割

- `src/pages`
  Next.js のルーティング層。画面と API エンドポイントだけを置く。
- `src/features/marketing`
  LP と集客導線の UI コンポーネント。
- `src/features/content`
  科目データと単元データの参照ロジック。
- `src/features/auth`
  認証コンテキストとサーバー側認証処理。
- `src/features/admin`
  管理画面用の共通 UI。
- `src/shared`
  全画面で共有するレイアウト要素。
- `src/security`
  環境変数検証、レート制限、ロガー、入力検証、XSS/CSRF 補助。

## 調査で確認した主要論点

- README と実装にズレがある。
  README は App Router や旧 API パスを前提にしていたが、実装は `src/pages` と `/api/content/subjects|units|search` ベース。
- 管理画面にモック実装が残っている。
  `src/pages/admin/content/*.js` は API 統合前提の UI を持つが、一部はダミーデータや疑似保存のまま。
- セキュリティ層は充実しているが未接続部分がある。
  `src/security/*` にバリデーションやレート制限がある一方、全 API でまだ一貫適用されていない。
- 学習データ層に不整合がある。
  `src/features/marketing/components/SubjectsSection.js` は現行 `subjects` 定義と整合しない古い参照ロジックを含む。
- 開発補助スクリプトが散在していた。
  ルート直下にあった `setup.js`、`check-directories.js`、`test-api.js` は `scripts/` に統合した。
- ルート直下に不要物候補がある。
  空の `prisma/`、入れ子の `gyoseishoshi-learning/.git`、生成物の `.next/` など、今後さらに整理余地がある。

## 今後の優先度

1. `SubjectsSection` を現行 `subjects` データ構造に合わせて作り直す。
2. 管理画面のモック保存処理を `/api/content/*` と接続する。
3. `src/security` の検証とレート制限を API ルートへ段階適用する。
4. `data/users.json` のファイル保存を本番向けストレージへ置き換える。
5. ルート直下のローカル専用ディレクトリと未使用資産を棚卸しする。

## 補足

- 今回はルーティングを壊さないことを優先し、`src/pages` は移動していません。
- `docs/development-process.md` と `docs/implementation-notes.md` は履歴資料として残しています。
