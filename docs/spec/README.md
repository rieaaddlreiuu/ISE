# 問題管理システム仕様

このディレクトリは、個人用の問題管理システムに関する仕様を分割してまとめたものである。

## ファイル構成

- [overview.md](./overview.md)
  - 目的、基本方針、スコープ
- [content-and-data.md](./content-and-data.md)
  - `Markdown + TeX` 本文仕様、問題データ、難易度
- [ai-and-assets.md](./ai-and-assets.md)
  - AI機能、解説版管理、画像管理
- [screens-and-flow.md](./screens-and-flow.md)
  - 画面仕様、作業フロー、出力
- [mvp.md](./mvp.md)
  - MVP、非機能要件、確定事項

## 現時点の要点

- このシステムを問題データの正本とする
- Overleaf は基本的に使わない
- 本文形式は `Markdown + TeX` とする
- 画像を問題に紐づけて管理し、本文中に埋め込めるようにする
- AIは難易度評価と解説生成を担当する
- AI出力は下書きとして履歴管理する
- 初期段階ではシングルユーザー前提とする
