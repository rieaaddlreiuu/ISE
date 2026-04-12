# 本文とデータ

## 1. 本文形式

本文系フィールドはすべて `Markdown + TeX` 形式で保存する。

対象フィールド:

- 問題文
- 解答
- 解説
- 作問メモ

仕様:

- 通常文は Markdown で記述する
- 数式は TeX 記法で記述する
- 画像は Markdown の画像記法で埋め込む

記述例:

```md
$f(x)=x^2-3x+2$ とする。

このとき、
$$
f(x)=0
$$
の解を求めよ。

![放物線のグラフ](/media/problems/problem-123/parabola.png)
```

## 2. 問題データ仕様

1問のデータ構造として、少なくとも以下を持つ。

- `id`
  - システム内部ID
- `serialCode`
  - 人が識別しやすい管理番号
- `title`
  - 問題の短い名称
- `subject`
  - 科目
- `domain`
  - 分野
- `tags`
  - 任意の複数タグ
- `statementMd`
  - 問題文本文
- `answerMd`
  - 解答本文
- `explanationMd`
  - 採用中の解説本文
- `authorMemoMd`
  - 非公開メモ
- `sourceType`
  - 自作 / 改題 / 参考あり
- `sourceDetail`
  - 元ネタや参考情報
- `status`
  - 下書き / 整理中 / 完成
- `difficultySelf`
  - 自己評価
- `difficultyAI`
  - AI評価
- `difficultyFinal`
  - 最終採用難易度
- `difficultyReasonAI`
  - AIの判断理由
- `targetLevel`
  - 想定対象層
- `estimatedSolveTime`
  - 想定解答時間
- `createdAt`
- `updatedAt`

## 3. 難易度仕様

難易度は次の3値を分けて管理する。

- `difficultySelf`
  - 作問者の自己評価
- `difficultyAI`
  - AIによる評価
- `difficultyFinal`
  - 最終的に採用する評価

ラベル難易度は5段階を基本とする。

- 1: 易
- 2: やや易
- 3: 標準
- 4: やや難
- 5: 難

補助的に以下の情報も持てるようにする。

- 想定対象層
- 想定解答時間
- 必要知識
- 典型性
- 計算量
- 発想量

## 4. データベースの想定

初期段階では、少なくとも以下の単位で管理できる構造を想定する。

- `problems`
- `problem_assets`
- `ai_evaluations`
- `solution_versions`

### `problems`

問題本体の情報を持つ。

### `problem_assets`

画像などの添付資産を持つ。

### `ai_evaluations`

AIによる難易度評価の履歴を持つ。

- 使用モデル
- 入力条件
- 結果
- 生成日時

### `solution_versions`

解説本文の版履歴を持つ。
