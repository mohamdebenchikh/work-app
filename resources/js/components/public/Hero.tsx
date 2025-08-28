import type { ReactNode } from 'react';

interface HeroProps {
    children: ReactNode;
}

export default function Hero({ children }: HeroProps) {
    return (
        <div className="rounded-lg border border-border bg-muted p-8">
            {children}
        </div>
    );
}


