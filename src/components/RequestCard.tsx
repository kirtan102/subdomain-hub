import { StatusBadge } from "@/components/StatusBadge";
import { RecordTypeBadge } from "@/components/RecordTypeBadge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Globe, Clock, Target } from "lucide-react";

interface RequestCardProps {
  subdomain: string;
  recordType: 'A' | 'CNAME' | 'TXT' | 'SRV';
  targetValue: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reason?: string;
  domain?: string;
}

export function RequestCard({
  subdomain,
  recordType,
  targetValue,
  status,
  createdAt,
  reason,
  domain = "yourdomain.com"
}: RequestCardProps) {
  return (
    <Card className="glass glass-hover overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-3">
            {/* Subdomain */}
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary flex-shrink-0" />
              <code className="font-mono text-base text-foreground truncate">
                <span className="text-primary">{subdomain}</span>
                <span className="text-muted-foreground">.{domain}</span>
              </code>
            </div>

            {/* Target */}
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <code className="font-mono text-sm text-muted-foreground truncate">
                {targetValue}
              </code>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
            </div>

            {/* Reason (if rejected) */}
            {reason && status === 'rejected' && (
              <p className="text-sm text-destructive/80 bg-destructive/10 px-3 py-2 rounded-md">
                {reason}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <RecordTypeBadge type={recordType} />
            <StatusBadge status={status} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
