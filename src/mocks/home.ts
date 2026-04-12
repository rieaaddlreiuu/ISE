export const summaryCards = [
    { label: "総問題数", value: 128, sub: "個人ストック全体" },
    { label: "公開済み", value: 36, sub: "配布・掲載中" },
    { label: "未公開", value: 92, sub: "手元保管" },
];

export const problems = [
    {
        id: "ALG-201",
        title: "二分探索で最小条件を求める",
        subject: "アルゴリズム",
        level: "標準",
        publicationStatus: "未公開",
        destinations: [],
        source: "Overleaf 下書きあり",
        updatedAt: "2026-04-11 18:20",
    },
    {
        id: "MTH-084",
        title: "図形とベクトルの融合問題",
        subject: "数学",
        level: "やや難",
        publicationStatus: "公開済み",
        destinations: ["塾プリント", "個人サイト"],
        source: "PDF 化済み",
        updatedAt: "2026-04-10 15:40",
    },
    {
        id: "JPN-031",
        title: "要約記述の採点基準確認",
        subject: "国語",
        level: "基礎",
        publicationStatus: "未公開",
        destinations: [],
        source: "メモのみ",
        updatedAt: "2026-04-09 21:05",
    },
    {
        id: "SCI-117",
        title: "実験考察から法則性を読む",
        subject: "理科",
        level: "標準",
        publicationStatus: "公開済み",
        destinations: ["学校配布", "模試用ストック"],
        source: "Overleaf 原稿あり",
        updatedAt: "2026-04-08 13:12",
    },
];

export const focusItems = [
    "未公開のまま埋もれている問題を把握する",
    "どこに公開したかをあとから追えるようにする",
    "Overleaf 原稿と問題データを同じ一覧で見られるようにする",
];

export const activities = [
    { title: "公開先を更新", meta: "MTH-084 / 個人サイトを追加", time: "2時間前" },
    { title: "問題メモを登録", meta: "JPN-031 / 要旨のみ保存", time: "今日 11:30" },
    { title: "Overleaf 原稿と紐付け", meta: "SCI-117", time: "昨日 21:05" },
];

export const publicationDestinations = [
    { name: "塾プリント", count: 14, note: "授業や演習で配布" },
    { name: "個人サイト", count: 9, note: "Web 掲載済み" },
    { name: "学校配布", count: 7, note: "授業資料として利用" },
    { name: "模試用ストック", count: 6, note: "再利用候補として保管" },
];

