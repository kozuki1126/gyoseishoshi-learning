# 🎯 行政書士学習サイト開発 - LLMカスタムインストラクション

## 📋 プロジェクト基本情報

**リポジトリURL**: https://github.com/kozuki1126/gyoseishoshi-learning  
**プロジェクト名**: 行政書士試験対策ウェブサイト  
**現在フェーズ**: プロトタイプ → 本格運用移行  
**開発期間**: 3-4ヶ月集中開発 (470-650時間)

### **技術スタック**
- **フロントエンド**: Next.js 14.2+ + TypeScript 5.5+ + Tailwind CSS 3.3+
- **バックエンド**: Next.js API Routes + Prisma ORM 5.15+
- **データベース**: PostgreSQL 15+ (Docker対応)
- **認証**: NextAuth.js v4 または 自作JWT + bcryptjs
- **決済**: Stripe SDK v14+
- **テスト**: Jest 29+ + React Testing Library + Playwright

---

## 🚨 **重要な前提条件**

### **セキュリティファースト原則**
1. **すべてのコード実装でセキュリティを最優先**
2. **入力検証・サニタイゼーションを必須実装**
3. **認証・認可の厳格な実装**
4. **SQLインジェクション・XSS対策を必須**

### **型安全性原則**
1. **TypeScript strict mode 必須**
2. **any型の使用禁止**
3. **Props・State・API レスポンスの完全型定義**

### **品質保証原則**
1. **テスト駆動開発 (TDD) 推奨**
2. **80%以上のテストカバレッジ維持**
3. **ESLint + Prettier による自動フォーマット**

---

## 📝 **コーディング規約・実装ガイドライン**

### **ファイル命名規則**
```
src/
├── components/          # React コンポーネント (.tsx)
│   ├── common/         # 共通コンポーネント
│   ├── forms/          # フォーム関連
│   └── __tests__/      # コンポーネントテスト
├── pages/              # Next.js ページ (.tsx)
│   ├── api/            # API ルート (.ts)
│   └── __tests__/      # ページテスト
├── lib/                # ユーティリティライブラリ
├── types/              # TypeScript 型定義
├── middleware/         # ミドルウェア
├── schemas/            # Zod バリデーションスキーマ
└── utils/              # ヘルパー関数
```

### **実装必須パターン**

#### **1. API エンドポイント実装**
```typescript
// 必須実装パターン
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import rateLimit from '@/middleware/rateLimit';

const schema = z.object({
  // バリデーションスキーマ必須
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // レート制限適用
  await rateLimit(req, res);
  
  try {
    // 入力検証
    const data = schema.parse(req.body);
    
    // 実装内容
    
  } catch (error) {
    // エラーハンドリング
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

#### **2. React コンポーネント実装**
```typescript
import React from 'react';

interface ComponentProps {
  // Props型定義必須
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // 実装内容
  
  return (
    <div className="tailwind-classes">
      {/* アクセシビリティ属性必須 */}
    </div>
  );
};

export default Component;
```

#### **3. データベース操作実装**
```typescript
import { prisma } from '@/lib/prisma';

// トランザクション使用推奨
export async function updateUserData(userId: string, data: UserData) {
  return await prisma.$transaction(async (tx) => {
    // 操作内容
  });
}
```

---

## 📋 **タスク実行プロセス**

### **必須実行フロー**
1. **TASKS.md の順番実行** (#001 → #241)
2. **各タスク完了時のログ記録**
3. **テスト実行・結果確認**
4. **コード品質チェック**
5. **セキュリティ検証**

### **タスク実行テンプレート**
```markdown
## 🔄 Task #{タスク番号} 実行ログ

### 📝 タスク概要
- **タスク**: #{番号} {タスク内容}
- **優先度**: {🔴/🟡/🟠/🟢}
- **推定時間**: {時間}
- **実行日時**: {YYYY-MM-DD HH:mm:ss}

### 💻 実装内容
```typescript
// 実装したコード
```

### 🧪 テスト結果
```bash
# テスト実行コマンド
# テスト結果出力
```

### ✅ 完了確認
- [ ] 実装完了
- [ ] テスト通過
- [ ] セキュリティチェック完了
- [ ] コード品質チェック完了

### 📊 実行結果
**ステータス**: ✅ 成功 / ❌ 失敗 / ⚠️ 部分完了
**実行時間**: {実際の所要時間}
**問題・改善点**: {あれば記載}

---
```

---

## 🔍 **各フェーズ別実行指示**

### **Phase 1: 緊急対応** (#001-#054)
#### **最重要セキュリティ対応**
```yaml
優先順位:
  1. JWT_SECRET必須化 (#001-#005)
  2. レート制限実装 (#006-#012)
  3. 入力検証強化 (#013-#019)
  4. ファイルセキュリティ (#024-#034)

実行前チェック:
  - 現在の脆弱性確認
  - 環境変数設定確認
  - テスト環境準備

実行後必須テスト:
  - セキュリティ攻撃シミュレーション
  - レート制限動作確認
  - ファイルアップロード安全性確認
```

### **Phase 2: 基盤強化** (#055-#113)
#### **データベース移行・TypeScript化**
```yaml
実行前準備:
  - PostgreSQL Docker環境構築
  - Prisma CLI インストール
  - バックアップ戦略確立

段階的実行:
  1. データベース設計 (#055-#061)
  2. 移行スクリプト作成 (#067-#072)
  3. データ移行実行 + テスト (#073-#076)
  4. TypeScript段階移行 (#092-#113)

検証項目:
  - データ整合性確認
  - パフォーマンス測定
  - 型エラー完全解消
```

### **Phase 3-5: 機能拡張・品質保証** (#114-#241)
#### **継続的インテグレーション**
```yaml
実行サイクル:
  - 週単位での進捗確認
  - 機能完成毎の統合テスト
  - UI/UX改善の継続評価
  - パフォーマンス監視
```

---

## 📊 **ログ記録・進捗管理システム**

### **ログ記録場所**
1. **TASKS.md 内**: 各タスクの実行結果
2. **development.log**: 詳細な実行ログ
3. **GitHub Issues**: 問題・バグ追跡
4. **Weekly Reports**: 週次進捗サマリ

### **進捗トラッキング形式**
```markdown
## 📈 開発進捗 (Week {週番号})

### ✅ 完了タスク
- [x] #001: JWT_SECRET必須化 - 2h (予定2-3h)
- [x] #002: エラー実装 - 1.5h (予定2-3h)

### 🚧 進行中タスク
- [ ] #003: シークレット生成スクリプト - 50% 完了

### 📊 統計
- **完了**: 15/54 タスク (28%)
- **予定通り**: 12タスク
- **遅延**: 3タスク
- **合計工数**: 45h/80h (56%)

### 🔍 主要な課題・解決策
1. **課題**: {問題内容}
   **解決策**: {対応方法}
   **期限**: {YYYY-MM-DD}
```

---

## ⚠️ **エラーハンドリング・リスク管理**

### **必須エラーハンドリング**
```typescript
// API エラーハンドリングテンプレート
try {
  // 実装内容
} catch (error) {
  // ログ記録
  logger.error('Task execution failed', {
    taskId: '#XXX',
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  
  // エラー分類・対応
  if (error instanceof ValidationError) {
    // バリデーションエラー対応
  } else if (error instanceof DatabaseError) {
    // データベースエラー対応
  } else {
    // 予期しないエラー対応
  }
}
```

### **リスク対応プロセス**
1. **即座の問題解決**: セキュリティ・システム停止リスク
2. **影響度評価**: ユーザー・データへの影響度確認
3. **ロールバック計画**: 最悪時の復旧手順
4. **予防策実装**: 再発防止策

---

## 🧪 **テスト実行・品質保証**

### **必須テストパターン**
```bash
# Phase 1 完了時の必須テスト
npm run test:security      # セキュリティテスト
npm run test:auth         # 認証フローテスト  
npm run test:upload       # ファイルアップロードテスト
npm run test:e2e          # E2E テスト

# 品質チェック
npm run lint              # コード品質
npm run type-check        # 型チェック
npm run test:coverage     # カバレッジ確認
```

### **テスト結果記録形式**
```markdown
### 🧪 テスト実行結果 - Task #{番号}

**実行日時**: {YYYY-MM-DD HH:mm:ss}
**テストスイート**: {テスト種類}

```bash
# テストコマンド
$ npm run test:security

# 結果出力
✅ Security Tests: 15 passed, 0 failed
✅ Authentication Tests: 8 passed, 0 failed
❌ File Upload Tests: 2 passed, 1 failed

Failed Test:
- test/upload/malicious-file.test.js
  Expected: File upload should be rejected
  Actual: File upload succeeded
```

**修正必要項目**: 
- [ ] 悪意ファイル検出ロジック強化

**総合評価**: ⚠️ 部分通過 (修正後再テスト必要)
```

---

## 🚀 **実行開始指示**

### **初回実行時の必須確認**
```markdown
## ✅ 開始前チェックリスト

### 環境確認
- [ ] Node.js 18+ インストール確認
- [ ] PostgreSQL 環境準備
- [ ] GitHub リポジトリアクセス確認
- [ ] 環境変数設定確認

### タスクリスト確認
- [ ] TASKS.md (#001-#241) 内容理解
- [ ] 優先度・依存関係確認
- [ ] 推定工数・期限確認

### ログ準備
- [ ] development.log ファイル作成
- [ ] 進捗トラッキング表準備
- [ ] エラーログ記録準備

### 実行開始
**開始コマンド**: "Phase 1 Task #001 から実行開始。各タスク完了毎にログ記録。"
```

---

## 💡 **重要な実行原則**

### **DO (必須実行)**
✅ TASKS.md の順番通り実行  
✅ 各タスク完了時の詳細ログ記録  
✅ セキュリティ最優先での実装  
✅ 型安全性の徹底確保  
✅ テスト完了後の次タスク移行  
✅ 問題発生時の即座の報告・対応  
✅ 週次進捗レビューの実施

### **DON'T (禁止事項)**
❌ タスク順序の勝手な変更  
❌ テスト未実施での次タスク移行  
❌ セキュリティチェックの省略  
❌ ログ記録の省略・簡略化  
❌ any型の使用  
❌ エラーハンドリングの省略

---

## 📞 **サポート・エスカレーション**

### **問題発生時の対応フロー**
1. **即座のログ記録**: 問題内容・エラー詳細
2. **影響度評価**: システム・ユーザーへの影響
3. **解決策検討**: 複数案の提示
4. **実装・テスト**: 修正実装・動作確認
5. **再発防止**: 予防策・改善案実装

### **定期レポート**
- **日次**: 完了タスク・問題点・翌日予定
- **週次**: 進捗サマリ・課題・リスク評価
- **フェーズ完了時**: 完了サマリ・品質評価・次フェーズ準備状況

---

**🎯 開始準備完了後、以下のコマンドで実行開始:**

```
"Phase 1 緊急対応開始。Task #001 JWT_SECRET必須化から実行。
実行結果は TASKS.md 内に詳細ログとして記録。
セキュリティ最優先で実装進行。"
```