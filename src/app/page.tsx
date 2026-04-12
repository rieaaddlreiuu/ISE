import { PageHeader } from "@/components/layout/pageHeader";
import { Card, CardHeader, SummaryCard } from "@/components/ui/card";
import { StyledButton } from "@/components/ui/styledButton";
import { Tabs } from "@/components/ui/tabs";

const summaryCards = [
    { label: "総問題数", value: 128, sub: "個人ストック全体" },
    { label: "公開済み", value: 36, sub: "配布・掲載中" },
    { label: "未公開", value: 92, sub: "手元保管" },
];

const problems = [
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

const focusItems = [
    "未公開のまま埋もれている問題を把握する",
    "どこに公開したかをあとから追えるようにする",
    "Overleaf 原稿と問題データを同じ一覧で見られるようにする",
];

const activities = [
    { title: "公開先を更新", meta: "MTH-084 / 個人サイトを追加", time: "2時間前" },
    { title: "問題メモを登録", meta: "JPN-031 / 要旨のみ保存", time: "今日 11:30" },
    { title: "Overleaf 原稿と紐付け", meta: "SCI-117", time: "昨日 21:05" },
];

const publicationDestinations = [
    { name: "塾プリント", count: 14, note: "授業や演習で配布" },
    { name: "個人サイト", count: 9, note: "Web 掲載済み" },
    { name: "学校配布", count: 7, note: "授業資料として利用" },
    { name: "模試用ストック", count: 6, note: "再利用候補として保管" },
];

function problemStatusClass(status: string) {
    if (status === "公開済み") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    return "bg-slate-100 text-slate-700 ring-slate-200";
}

function ProblemList({ items }: { items: typeof problems }) {
    return (
        <div className="space-y-3">
            {items.map((problem) => (
                <div
                    key={problem.id}
                    className="grid gap-4 rounded-none border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1.45fr_0.8fr_0.95fr_0.75fr]"
                >
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded bg-slate-900 px-2 py-1 text-[11px] font-medium tracking-[0.18em] text-white">
                                {problem.id}
                            </span>
                            <span className="text-xs text-slate-500">{problem.subject}</span>
                        </div>
                        <div className="mt-2 text-sm font-semibold text-slate-900">{problem.title}</div>
                    </div>

                    <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-1">
                        <div>
                            <dt className="text-xs text-slate-500">難易度</dt>
                            <dd className="mt-1 text-slate-900">{problem.level}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-slate-500">原稿状況</dt>
                            <dd className="mt-1 text-slate-900">{problem.source}</dd>
                        </div>
                    </dl>

                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${problemStatusClass(problem.publicationStatus)}`}
                            >
                                {problem.publicationStatus}
                            </span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500">公開先</div>
                        <div className="mt-1 flex flex-wrap gap-2">
                            {problem.destinations.length > 0 ? (
                                problem.destinations.map((destination) => (
                                    <span
                                        key={destination}
                                        className="inline-flex items-center rounded-full bg-white px-2 py-1 text-xs text-slate-700 ring-1 ring-slate-200"
                                    >
                                        {destination}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-slate-500">未設定</span>
                            )}
                        </div>
                    </div>

                    <div className="text-sm md:text-right">
                        <div className="text-xs text-slate-500">最終更新</div>
                        <div className="mt-1 text-slate-900">{problem.updatedAt}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Home() {
    const listedTabs = [
        {
            id: "all",
            label: "すべて",
            description: "全件表示",
            content: <ProblemList items={problems} />,
        },
        {
            id: "private",
            label: "未公開",
            description: "手元管理",
            content: (
                <ProblemList
                    items={problems.filter((problem) => problem.publicationStatus === "未公開")}
                />
            ),
        },
        {
            id: "published",
            label: "公開済み",
            description: "配布・掲載済み",
            content: (
                <ProblemList
                    items={problems.filter((problem) => problem.publicationStatus === "公開済み")}
                />
            ),
        },
    ];

    return (
        <main className="min-h-screen bg-slate-100">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                <PageHeader
                    title="問題ストック管理"
                    description="個人で作った問題を、公開有無と公開先を中心に管理する試作画面です。"
                    meta="2026年度 4月第2週"
                    actions={
                        <>
                            <StyledButton className="border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                                公開先を確認
                            </StyledButton>
                            <StyledButton className="bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                                新しい問題を追加
                            </StyledButton>
                        </>
                    }
                />

                <section className="grid gap-4 md:grid-cols-3">
                    {summaryCards.map((card) => (
                        <SummaryCard key={card.label} label={card.label} value={card.value} sub={card.sub} />
                    ))}
                </section>

                <section className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
                    <div className="space-y-6">
                        <Tabs tabs={listedTabs} initialTabId="all" />

                        <Card>
                            <CardHeader
                                title="公開先ごとの内訳"
                                subtitle="どこで使った問題かをまとめて確認"
                                right={<span className="text-xs text-slate-500">公開済みのみ</span>}
                            />
                            <div className="grid gap-4 p-4 md:grid-cols-4">
                                {publicationDestinations.map((destination) => (
                                    <div key={destination.name} className="rounded-none border border-slate-200 bg-slate-50 p-4">
                                        <div className="text-xs font-medium tracking-[0.18em] text-slate-500 uppercase">
                                            公開先
                                        </div>
                                        <div className="mt-3 text-lg font-semibold text-slate-900">{destination.name}</div>
                                        <div className="mt-2 text-3xl font-semibold text-slate-900">{destination.count}</div>
                                        <div className="mt-2 text-sm leading-6 text-slate-600">{destination.note}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader title="今週の注力" subtitle="優先して処理したい項目" />
                            <div className="space-y-3 p-4">
                                {focusItems.map((item) => (
                                    <div key={item} className="rounded-none border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card>
                            <CardHeader title="最近の更新" subtitle="時系列で確認" />
                            <div className="space-y-3 p-4">
                                {activities.map((activity) => (
                                    <div key={`${activity.title}-${activity.time}`} className="rounded-none border border-slate-200 bg-slate-50 p-4">
                                        <div className="text-sm font-semibold text-slate-900">{activity.title}</div>
                                        <div className="mt-1 text-sm text-slate-600">{activity.meta}</div>
                                        <div className="mt-3 text-xs text-slate-500">{activity.time}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="border-blue-200 bg-blue-50">
                            <CardHeader title="試作の意図" subtitle="個人用の問題保管を前提にした構成" />
                            <div className="p-4 text-sm leading-7 text-slate-700">
                                作問の進行管理ではなく、作った問題を埋もれさせないための保管台帳として寄せています。
                                公開有無、公開先、原稿の所在を一覧で見られる形です。
                            </div>
                        </Card>
                    </div>
                </section>
            </div>
        </main>
    );
}
