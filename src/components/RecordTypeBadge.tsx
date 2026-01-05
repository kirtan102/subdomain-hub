import { cn } from "@/lib/utils";

interface RecordTypeBadgeProps {
  type: 'A' | 'CNAME' | 'TXT' | 'SRV' | 'MX';
  className?: string;
}

// Update color mappings for better visibility and add MX support
export function RecordTypeBadge({ type, className }: RecordTypeBadgeProps) {
  // Keeping styles subtle and consistent as requested, fixing CNAME visibility by aligning with A record style
  const defaultStyle = 'bg-secondary/50 text-foreground border-secondary-foreground/20';

  const colors: Record<string, string> = {
    A: defaultStyle,
    CNAME: defaultStyle,
    TXT: defaultStyle,
    SRV: defaultStyle,
    MX: defaultStyle,
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md font-mono text-xs font-bold border',
        colors[type] || colors.TXT,
        className
      )}
    >
      {type}
    </span>
  );
}
