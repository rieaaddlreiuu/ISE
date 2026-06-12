import type { ReactNode } from "react";

type StyledButtonProperties = {
    onClick?: () => void;
    children: ReactNode;
    className?: string;
};

export function StyledButton(properties: StyledButtonProperties) {
    return (
        <button
            onClick={properties.onClick}
            className={`inline-flex items-center justify-center rounded-md px-6 py-2 text-base font-medium text-blue-600 hover:bg-blue-100 disabled:opacity-50 ${properties.className ?? ""}`}
        >
            {properties.children}
        </button>
    );
}
