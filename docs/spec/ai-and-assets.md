# AIと画像

## 1. AI機能

### 1.1 難易度評価

入力:

- 問題文
- 科目
- 分野
- 想定対象
- 必要に応じて解答メモ

出力:

- 難易度ラベル
- 難易度の根拠
- 想定解答時間
- 必要知識
- つまずきやすい点
- 典型 / 準典型 / 非典型の類型

### 1.2 解説生成

入力:

- 問題文
- 解答または方針メモ
- 想定読者レベル
- 文体指定

出力:

- `Markdown + TeX` 形式の解説本文

### 1.3 AI利用時の基本ルール

- AI出力は常に下書きとして保存する
- 既存の手修正済み解説を直接上書きしない
- 同一問題に対して複数回生成できる
- 生成履歴を保持する
- 初期段階では AI はテキスト中心で扱う

## 2. 解説の版管理

解説は上書きではなく版管理する。

各解説版は以下を持つ。

- `id`
- `problemId`
- `sourceType`
  - manual / ai
- `promptSummary`
- `contentMd`
- `isAdopted`
- `createdAt`

採用中の解説は1つだけ持つ。

## 3. 画像仕様

画像は問題に紐づく添付資産として管理する。

必要機能:

- 画像アップロード
- 問題ごとの画像一覧表示
- 本文中への画像挿入
- 画像プレビュー
- 画像差し替え
- 画像削除

画像データとして保持する項目:

- `id`
- `problemId`
- `kind`
  - figure / diagram / supplementary
- `storagePath`
- `originalFileName`
- `mimeType`
- `size`
- `width`
- `height`
- `altText`
- `caption`
- `createdAt`

本文内では Markdown 画像記法で参照する。

例:

```md
![三角形の図](/media/problems/problem-123/triangle-1.png)
```

初期段階では、外部URL参照よりもアプリ管理下への保存を優先する。
