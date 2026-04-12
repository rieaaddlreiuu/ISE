import type { ReactNode } from "react";

export default function ProblemsLayout({ children }: { children: ReactNode }) {
    return <div className="problems-route">{children}</div>;
}
