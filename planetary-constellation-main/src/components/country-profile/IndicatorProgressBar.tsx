interface Props {
    label: string;
    value: string | number;
    percent: number;
    colorClass: string;
}

export function IndicatorProgressBar({ label, value, percent, colorClass }: Props) {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500 font-medium truncate pr-2">{label}</span>
                <span className="font-mono-data font-semibold text-slate-700 whitespace-nowrap">{value}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${colorClass}`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}
