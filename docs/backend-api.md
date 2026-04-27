# Backend API Requirements

## 前提

- 現状の画面は `src/mocks/*` を参照している箇所が多く、実データ連携は未実装
- DB スキーマ上の主対象は `Problem` と `ProblemAsset`
- 本ドキュメントは、現行 UI を DB ベースで動かすために必要な API を整理したもの
- URL は REST 形式で記載しているが、保存系の一部は Server Actions に置き換えてもよい

## 1. 問題一覧取得

- Method: `GET`
- Path: `/api/problems`
- 用途: 問題一覧画面 `/problems` の表示

### 主な処理

- 問題一覧を取得する
- `archivedAt` が入っている論理削除済みデータを除外する
- 条件検索を適用する
- ページングと並び順を適用する

### 想定クエリ

- `q`: タイトル、問題文、タグなどのキーワード検索
- `status`: `draft` / `review` / `ready` / `published`
- `subject`: 教科
- `tag`: タグ
- `page`: ページ番号
- `pageSize`: 取得件数
- `sort`: `updatedAt` など
- `order`: `asc` / `desc`

### レスポンス内容

- 問題一覧
- 総件数
- 現在ページ
- ページサイズ

## 2. 問題サマリー取得

- Method: `GET`
- Path: `/api/problems/summary`
- 用途: 問題一覧上部の件数カード表示

### 主な処理

- 全件数を集計する
- ステータス別件数を返す
- 必要なら教科別件数も返す

### レスポンス内容

- `total`
- `draftCount`
- `reviewCount`
- `readyCount`
- `publishedCount`

## 3. 問題詳細取得

- Method: `GET`
- Path: `/api/problems/:id`
- 用途: 問題詳細画面 `/problems/[problemId]`

### 主な処理

- `id` で問題を 1 件取得する
- 存在しない場合は `404`
- 論理削除済みなら `404`
- 関連する画像一覧も必要に応じて含める

### レスポンス内容

- 問題本体
- 画像一覧
- 表示に必要な整形済み値

## 4. 問題新規作成

- Method: `POST`
- Path: `/api/problems`
- 用途: `/problems/new`

### 主な処理

- 入力値をバリデーションする
- `serialCode` を生成または受け取る
- `serialCode` の重複を検査する
- 問題を新規作成する
- 初期ステータスを設定する

### 主な入力項目

- `serialCode`
- `title`
- `subject`
- `domain`
- `tagsText`
- `status`
- `statementMd`
- `answerMd`
- `explanationMd`
- `authorMemoMd`
- `sourceType`
- `sourceDetail`
- `difficultySelf`
- `targetLevel`
- `estimatedSolveTime`

### レスポンス内容

- 作成した問題の `id`
- 作成結果

## 5. 問題メタ情報更新

- Method: `PATCH`
- Path: `/api/problems/:id/metadata`
- 用途: `/problems/[problemId]/edit/metadata`

### 主な処理

- 対象問題を取得する
- 存在確認を行う
- メタ情報のみ更新する
- `serialCode` を編集可能にする場合は重複チェックする

### 更新対象

- `serialCode`
- `title`
- `subject`
- `domain`
- `tagsText`
- `status`
- `difficultySelf`
- `targetLevel`
- `estimatedSolveTime`

## 6. 問題本文更新

- Method: `PATCH`
- Path: `/api/problems/:id/text`
- 用途: `/problems/[problemId]/edit/text`

### 主な処理

- 対象問題を取得する
- Markdown/TeX 前提の本文を保存する
- 空文字や必須欠落を検査する

### 更新対象

- `statementMd`
- `answerMd`
- `explanationMd`
- `authorMemoMd`

## 7. 問題公開情報更新

- Method: `PATCH`
- Path: `/api/problems/:id/publish`
- 用途: `/problems/[problemId]/edit/publish`

### 主な処理

- 出典情報を更新する
- 公開先情報を更新する
- 公開可能条件を満たすか検査する

### 更新対象

- `sourceType`
- `sourceDetail`
- 公開先
- 公開メモ

### 注意

- 現在の Prisma スキーマには公開先や公開メモの保存先がない
- 本機能を本実装するには追加カラムまたは別テーブルが必要

## 8. 問題削除

- Method: `DELETE`
- Path: `/api/problems/:id`
- 用途: 詳細画面・編集画面の削除操作

### 主な処理

- 対象問題の存在確認
- 論理削除する
- `archivedAt` に削除日時を入れる

### 注意

- 物理削除も可能だが、一覧・履歴・復元を考えると論理削除が安全
- 画像も同時削除するなら関連ファイルの扱いを決める必要がある

## 9. 問題画像一覧取得

- Method: `GET`
- Path: `/api/problems/:id/assets`
- 用途: assets タブ、編集画面の画像一覧

### 主な処理

- 問題に紐づく `ProblemAsset` を取得する
- ソート順を適用する

### レスポンス内容

- `id`
- `storageKey`
- `fileName`
- `mimeType`
- `width`
- `height`
- `sizeBytes`
- `altText`
- 画像 URL
- Markdown 埋め込み用文字列

## 10. 問題画像アップロード

- Method: `POST`
- Path: `/api/problems/:id/assets`
- 用途: `/problems/[problemId]/edit/assets`

### 主な処理

- 対象問題の存在確認
- ファイル種別とサイズを検査する
- 保存先へファイルを保存する
- DB に `ProblemAsset` を作成する
- 画像サイズを取得できるなら `width` と `height` を保存する

### 主な入力

- multipart/form-data
- file
- altText

### 注意

- 実ファイル保存先を決める必要がある
  - ローカルディスク
  - S3 などのオブジェクトストレージ

## 11. 問題画像メタ更新

- Method: `PATCH`
- Path: `/api/problems/:id/assets/:assetId`
- 用途: 画像の説明文や表示情報の更新

### 主な処理

- 対象画像の存在確認
- 問題との紐づき確認
- 更新可能なメタ情報だけ更新する

### 更新対象

- `altText`
- 必要なら `fileName`

## 12. 問題画像削除

- Method: `DELETE`
- Path: `/api/problems/:id/assets/:assetId`
- 用途: assets 画面での削除

### 主な処理

- 対象画像の存在確認
- DB レコードを削除する
- 保存先の実ファイルを削除する

## 13. AI 難易度推定

- Method: `POST`
- Path: `/api/problems/:id/ai/difficulty`
- 用途: メタ情報編集画面の AI 補助

### 主な処理

- 対象問題を取得する
- 問題文と既存メタ情報を AI に渡す
- 推定難易度と理由を返す
- 必要なら結果を保存せず一時返却にする

### レスポンス内容

- 推定難易度
- 信頼度
- 根拠テキスト

## 14. AI 解説ドラフト生成

- Method: `POST`
- Path: `/api/problems/:id/ai/commentary`
- 用途: 本文編集画面の AI 補助

### 主な処理

- 対象問題を取得する
- 問題文、解答、既存解説を AI に渡す
- 解説ドラフトを返す

### レスポンス内容

- 解説案
- 要約
- 注意点

## 15. 共通バリデーション

各 API で共通して必要な処理。

- 必須項目チェック
- 文字数制限
- 列挙値チェック
- `serialCode` 一意制約チェック
- 存在確認
- 論理削除済みチェック

## 16. 共通認証・認可

編集系 API で必要な処理。

- ログイン確認
- セッション検証
- 権限確認

### 対象

- `POST /api/problems`
- `PATCH /api/problems/:id/*`
- `DELETE /api/problems/:id`
- `POST /api/problems/:id/assets`
- `PATCH /api/problems/:id/assets/:assetId`
- `DELETE /api/problems/:id/assets/:assetId`
- AI 実行 API

## 17. 共通エラーハンドリング

最低限そろえるべきレスポンス。

- `400`: リクエスト不正
- `401`: 未認証
- `403`: 権限なし
- `404`: 対象なし
- `409`: 一意制約衝突
- `422`: バリデーションエラー
- `429`: レート制限
- `500`: サーバーエラー

## 18. 初期実装の優先順位

最初に必要なのは次の API。

1. `GET /api/problems`
2. `GET /api/problems/:id`
3. `POST /api/problems`
4. `PATCH /api/problems/:id/metadata`
5. `PATCH /api/problems/:id/text`
6. `DELETE /api/problems/:id`
7. `GET /api/problems/:id/assets`
8. `POST /api/problems/:id/assets`

## 19. 補足

- 公開先、公開メモ、履歴、編集者、監査ログは現行 Prisma スキーマには未定義
- そのため、公開管理や履歴表示を本実装する場合は追加テーブル設計が必要
- 削除は現状 Cookie ベースの仮実装だが、本実装では DB 側に寄せるべき
