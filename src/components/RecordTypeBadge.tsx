import { cn } from "@/lib/utils";

interface RecordTypeBadgeProps {
  type: 'A' | 'CNAME' | 'TXT' | 'SRV';
  className?: string;
}

export function RecordTypeBadge({ type, className }: RecordTypeBadgeProps) {
  const colors = {
    A: 'bg-primary/20 text-primary border-primary/30',
    CNAME: 'bg-accent/20 text-accent border-accent/30',
    TXT: 'bg-muted text-muted-foreground border-border',
    SRV: 'bg-success/20 text-success border-success/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded font-mono text-xs font-semibold border',
        colors[type],
        className
      )}
    >
      {type}
    </span>
  );
}
