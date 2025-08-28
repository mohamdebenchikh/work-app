import { Users, Briefcase, Building2 } from 'lucide-react';

export default function StatsRow() {
    const stats = [
        { icon: Users, value: '1000+', label: 'Providers' },
        { icon: Briefcase, value: '500+', label: 'Services done' },
        { icon: Building2, value: '+15', label: 'Cities' },
    ];
    return (
        <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm">
            {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="rounded-md border border-border bg-card p-3">
                    <div className="text-base font-semibold">{value}</div>
                    <div className="mt-1 inline-flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                    </div>
                </div>
            ))}
        </div>
    );
}


