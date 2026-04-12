import type { ReactNode } from 'react';

type DefaultProperties = { children: ReactNode };

export function Default(properties: DefaultProperties) {
    return (
        <div className="mx-auto w-full max-w-[1200px] px-4 py-2 sm:px-6 sm:py-4">
            <div className="py-2 sm:py-4">
                <div className="mx-auto max-w-5xl rounded-none bg-white p-6 shadow-md sm:p-8">
                    {properties.children}
                </div>
            </div>
        </div>
    );
}
