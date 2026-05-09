type DifficultyValueProps = {
    value: number | null;
    fallback?: string;
};

export function DifficultyValue({ value, fallback = '-' }: DifficultyValueProps) {
    if (value === null) {
        return <>{fallback}</>;
    }

    if (value === 10) {
        return <span className="font-semibold text-amber-600">{value}</span>;
    }

    if (value === 11) {
        return <span className="font-semibold text-[#ff0000]">{value}</span>;
    }

    return <>{value}</>;
}
