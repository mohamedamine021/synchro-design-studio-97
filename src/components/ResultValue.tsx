interface ResultValueProps {
  label: string;
  value: number | string | null | undefined;
  unit?: string;
  precision?: number;
  variant?: 'primary' | 'success' | 'warning';
}

export function ResultValue({ label, value, unit = '', precision = 4, variant = 'primary' }: ResultValueProps) {
  const colorClass = variant === 'success' ? 'text-success' : variant === 'warning' ? 'text-warning' : 'text-result';
  
  const formatted = typeof value === 'number'
    ? value < 0.01 && value > 0 ? value.toExponential(2) : Number(value.toPrecision(precision))
    : value;

  return (
    <div className="flex items-center justify-between py-1.5 px-3 rounded-md bg-muted/50 border border-border/50">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`font-mono-eng text-sm font-semibold ${colorClass}`}>
        {formatted ?? '—'} {unit && <span className="text-muted-foreground font-normal ml-1">{unit}</span>}
      </span>
    </div>
  );
}
