export type ProblemDetail = {
    id: string;
    title: string;
    subject: string;
    level: string;
    format: string;
    status: string;
    source: string;
    updatedAt: string;
    createdBy: string;
    destinations: string[];
    tags: string[];
    statement: string;
    answer: string;
    commentary: string;
    reviewMemo: string;
    checklist: string[];
    timeline: Array<{
        label: string;
        value: string;
    }>;
};

const problemDetails: Record<string, ProblemDetail> = {
    "ALG-201": {
        id: "ALG-201",
        title: "整数条件つきで最大値と最小値を求める問題",
        subject: "数学",
        level: "標準",
        format: "記述",
        status: "下書き",
        source: "Overleaf 草稿",
        updatedAt: "2026-04-11 18:20",
        createdBy: "高橋",
        destinations: [],
        tags: ["整数", "場合分け", "最大最小"],
        statement:
            "正の整数 a, b が a + b = 12 を満たしている。ab の最大値と最小値を求め、そのときの a, b の組をすべて答えなさい。",
        answer:
            "ab の最大値は 36、最小値は 11。最大値は (a, b) = (6, 6) のとき、最小値は (1, 11), (11, 1) のときにとる。",
        commentary:
            "和が一定のとき積は中央に近いほど大きくなる、という見通しを持てるかを確認する問題です。整数条件があるため、二次関数だけで押し切るよりも、候補を整理して対称性を使えるかを見る構成にしています。",
        reviewMemo:
            "図表なしで成立。模範解答は『一覧表で確認する解法』と『平方完成で説明する解法』の 2 本立てにする想定。",
        checklist: ["問題文の言い回し確認", "模範解答整備", "公開先の選定"],
        timeline: [
            { label: "作成日", value: "2026-04-08 10:15" },
            { label: "最終更新", value: "2026-04-11 18:20" },
            { label: "レビュー担当", value: "未設定" },
        ],
    },
    "MTH-084": {
        id: "MTH-084",
        title: "ベクトルの内積を使った図形証明",
        subject: "数学",
        level: "やや難",
        format: "記述",
        status: "公開済み",
        source: "PDF 取り込み",
        updatedAt: "2026-04-10 15:40",
        createdBy: "佐藤",
        destinations: ["学内サイト", "授業配布"],
        tags: ["ベクトル", "図形", "証明"],
        statement:
            "三角形 ABC において、点 P を辺 BC 上の点とする。AP と BC が垂直であることを、ベクトルの内積を用いて示しなさい。",
        answer:
            "ベクトル AP と BC の内積が 0 であることを示せばよい。条件から各ベクトルを成分表示し、整理すると AP・BC = 0 となるため、AP ⟂ BC が従う。",
        commentary:
            "証明の型を押さえているかを見るための問題です。答案では、何を示せば垂直といえるのかを最初に明言できているかを採点の主眼に置いています。",
        reviewMemo:
            "公開済み。授業配布版では補助図を追加済み。Web 版でも同じ図版に差し替える可能性あり。",
        checklist: ["Web 掲載図版の差し替え", "解説末尾の補足確認"],
        timeline: [
            { label: "作成日", value: "2026-03-28 09:00" },
            { label: "公開日", value: "2026-04-05 08:30" },
            { label: "最終更新", value: "2026-04-10 15:40" },
        ],
    },
    "JPN-031": {
        id: "JPN-031",
        title: "論説文読解の根拠を説明する短答問題",
        subject: "国語",
        level: "標準",
        format: "短答",
        status: "レビュー中",
        source: "メモのみ",
        updatedAt: "2026-04-09 21:05",
        createdBy: "中村",
        destinations: ["添削教材"],
        tags: ["現代文", "読解", "記述"],
        statement:
            "筆者が『対話が理解を深める』と述べる根拠を、本文中の内容を踏まえて 40 字以内で説明しなさい。",
        answer:
            "異なる視点に触れることで、自分一人では気づけない前提や解釈を見直せるから。",
        commentary:
            "本文の主張と理由を切り分けて読めているかを確認する短答です。本文表現の言い換えで済ませず、因果関係が書けているかを重視します。",
        reviewMemo:
            "設問文の字数制限を 35 字にする案あり。本文抜粋との整合確認が未了。",
        checklist: ["本文抜粋の確定", "字数制限の決定"],
        timeline: [
            { label: "作成日", value: "2026-04-06 14:20" },
            { label: "レビュー依頼", value: "2026-04-09 18:00" },
            { label: "最終更新", value: "2026-04-09 21:05" },
        ],
    },
};

function createFallbackProblemDetail(problemId: string): ProblemDetail {
    return {
        id: problemId,
        title: `${problemId} のモック問題詳細`,
        subject: "未設定",
        level: "未設定",
        format: "記述",
        status: "下書き",
        source: "mock",
        updatedAt: "2026-04-12 00:00",
        createdBy: "システム",
        destinations: [],
        tags: ["mock"],
        statement: `${problemId} に対応する実データはまだ用意されていないため、仮の問題文を表示しています。`,
        answer: "仮の解答です。",
        commentary: "問題詳細画面のレイアウト確認用のフォールバックデータです。",
        reviewMemo: "実データ接続時に差し替えます。",
        checklist: ["実データ接続", "公開先設定"],
        timeline: [
            { label: "作成日", value: "2026-04-12 00:00" },
            { label: "最終更新", value: "2026-04-12 00:00" },
        ],
    };
}

export const problemDetailIds = Object.keys(problemDetails);

export function getProblemDetailMock(problemId: string): ProblemDetail {
    return problemDetails[problemId] ?? createFallbackProblemDetail(problemId);
}
