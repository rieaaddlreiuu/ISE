export type ProblemEditFormValue = {
    id: string;
    title: string;
    status: string;
    subject: string;
    difficulty: string;
    format: string;
    tags: string;
    statement: string;
    answerPolicy: string;
    gradingMemo: string;
    source: string;
    notes: string;
    destinations: string[];
    updatedAt: string;
    editor: string;
};

export type ProblemEditActivity = {
    label: string;
    detail: string;
    timestamp: string;
};

export type ProblemEditScreenData = {
    form: ProblemEditFormValue;
    progress: { label: string; value: string; note: string }[];
    checklist: string[];
    activities: ProblemEditActivity[];
};

const problemEditMocks: Record<string, ProblemEditScreenData> = {
    "ALG-201": {
        form: {
            id: "ALG-201",
            title: "整数 a, b が a + b = 12 を満たすとき、ab の最大値と最小値を求める",
            status: "draft",
            subject: "math",
            difficulty: "standard",
            format: "descriptive",
            tags: "整数, 2次関数, 最大値・最小値",
            statement:
                "整数 a, b が a + b = 12 を満たしている。ab の最大値と最小値をそれぞれ求め、そのときの a, b の組も答えなさい。",
            answerPolicy:
                "平方完成または対称性を使って説明できていれば可。途中式では a = 12 - b とおく変形が明示されていること。",
            gradingMemo:
                "最大値のみで終了している答案が多いため、最小値側の論理展開も確認する。整数条件の言及がない場合は部分点。",
            source: "自作 / 2026 春期講習 数学演習",
            notes: "先に Web 公開は行わず、冊子掲載の確認後に公開へ進める。",
            destinations: ["booklet", "web"],
            updatedAt: "2026-04-11 18:20",
            editor: "田中 玲奈",
        },
        progress: [
            { label: "下書き", value: "完了", note: "初稿は登録済み" },
            { label: "レビュー", value: "未着手", note: "採点基準の確認待ち" },
            { label: "公開準備", value: "保留", note: "掲載媒体の確定後に着手" },
        ],
        checklist: [
            "問題文と解答方針の数式表記を統一する",
            "採点メモに部分点条件を明記する",
            "公開先ごとの差分がないか確認する",
            "最終更新者と更新日時を保存対象に含める",
        ],
        activities: [
            {
                label: "本文更新",
                detail: "問題文の末尾を受験者向け表現に調整",
                timestamp: "2026-04-11 18:20",
            },
            {
                label: "タグ整理",
                detail: "検索用タグを 2 件追加",
                timestamp: "2026-04-11 17:05",
            },
            {
                label: "新規登録",
                detail: "新規問題として下書きを作成",
                timestamp: "2026-04-10 09:40",
            },
        ],
    },
    "MTH-084": {
        form: {
            id: "MTH-084",
            title: "ベクトルの内積を用いて三角形の形状を判定する",
            status: "published",
            subject: "math",
            difficulty: "hard",
            format: "descriptive",
            tags: "ベクトル, 内積, 図形",
            statement:
                "座標平面上の 3 点 A, B, C が与えられている。ベクトルの内積を用いて三角形 ABC が直角三角形となる条件を導きなさい。",
            answerPolicy:
                "どの頂点が直角になるかを場合分けし、対応する内積が 0 になることを説明していれば可。",
            gradingMemo:
                "図示がなくても論理が通っていれば満点。成分計算のみで結論が飛んでいる場合は 1 段階減点。",
            source: "PDF 取り込み / 模試改題",
            notes: "既に公開済みのため、変更時は冊子版との差分確認が必要。",
            destinations: ["booklet", "print"],
            updatedAt: "2026-04-10 15:40",
            editor: "佐藤 雄介",
        },
        progress: [
            { label: "下書き", value: "完了", note: "登録済み" },
            { label: "レビュー", value: "完了", note: "監修確認済み" },
            { label: "公開準備", value: "完了", note: "冊子・印刷へ反映済み" },
        ],
        checklist: [
            "公開済み媒体との文面差分を確認する",
            "図版差し替え時は印刷用データも更新する",
            "採点基準の改定有無を講師側へ共有する",
        ],
        activities: [
            {
                label: "公開反映",
                detail: "印刷用データへ反映",
                timestamp: "2026-04-10 15:40",
            },
            {
                label: "レビュー完了",
                detail: "数学科監修のコメントを反映",
                timestamp: "2026-04-09 13:10",
            },
        ],
    },
};

const defaultProblemEditScreenData = (problemId: string): ProblemEditScreenData => ({
    form: {
        id: problemId,
        title: `${problemId} の編集モック`,
        status: "draft",
        subject: "other",
        difficulty: "standard",
        format: "descriptive",
        tags: "モック, 編集画面",
        statement: "ここに問題文モックを表示します。",
        answerPolicy: "ここに解答方針モックを表示します。",
        gradingMemo: "ここに採点メモモックを表示します。",
        source: "仮データ",
        notes: "存在しない ID 向けに生成した仮データです。",
        destinations: ["web"],
        updatedAt: "2026-04-12 23:30",
        editor: "システム",
    },
    progress: [
        { label: "下書き", value: "編集中", note: "仮データから生成" },
        { label: "レビュー", value: "未着手", note: "担当未設定" },
        { label: "公開準備", value: "未着手", note: "媒体未選択" },
    ],
    checklist: [
        "仮データのため実データ接続時に置き換える",
        "保存 API 追加時にバリデーションを揃える",
    ],
    activities: [
        {
            label: "自動生成",
            detail: "存在しない problemId からモックを生成",
            timestamp: "2026-04-12 23:30",
        },
    ],
});

export function getProblemEditScreenData(problemId: string): ProblemEditScreenData {
    return problemEditMocks[problemId] ?? defaultProblemEditScreenData(problemId);
}
