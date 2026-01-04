import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, Globe } from "lucide-react";
import { z } from "zod";

const subdomainSchema = z.object({
  subdomain: z.string()
    .min(1, "Subdomain is required")
    .max(63, "Subdomain must be 63 characters or less")
    .regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, "Only lowercase letters, numbers, and hyphens allowed"),
  recordType: z.enum(['A', 'CNAME', 'TXT', 'SRV']),
  targetValue: z.string().min(1, "Target value is required").max(255, "Target value too long"),
  ttl: z.number().min(60).max(86400),
});

interface RequestFormProps {
  onSuccess?: () => void;
  domain?: string;
}

export function RequestForm({ onSuccess, domain = "yourdomain.com" }: RequestFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [subdomain, setSubdomain] = useState("");
  const [recordType, setRecordType] = useState<'A' | 'CNAME' | 'TXT' | 'SRV'>('A');
  const [targetValue, setTargetValue] = useState("");
  const [ttl, setTtl] = useState(3600);

  const placeholders = {
    A: "192.168.1.1",
    CNAME: "example.com",
    TXT: "v=spf1 include:example.com ~all",
    SRV: "0 5 5269 xmpp.example.com",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to submit a request");
      return;
    }

    const validation = subdomainSchema.safeParse({
      subdomain,
      recordType,
      targetValue,
      ttl,
    });

    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('subdomain_requests')
        .insert({
          user_id: user.id,
          subdomain,
          record_type: recordType,
          target_value: targetValue,
          ttl,
        });

      if (error) throw error;

      toast.success("Request submitted successfully!");
      setSubdomain("");
      setTargetValue("");
      setTtl(3600);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Subdomain Input */}
      <div className="space-y-2">
        <Label htmlFor="subdomain">Subdomain</Label>
        <div className="flex items-center gap-0">
          <Input
            id="subdomain"
            placeholder="myserver"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
            className="rounded-r-none border-r-0"
          />
          <div className="h-11 px-4 flex items-center bg-secondary border border-border border-l-0 rounded-r-lg">
            <span className="text-muted-foreground font-mono text-sm">.{domain}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Lowercase letters, numbers, and hyphens only
        </p>
      </div>

      {/* Record Type */}
      <div className="space-y-2">
        <Label htmlFor="recordType">Record Type</Label>
        <Select value={recordType} onValueChange={(v) => setRecordType(v as any)}>
          <SelectTrigger id="recordType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A Record (IPv4 Address)</SelectItem>
            <SelectItem value="CNAME">CNAME (Alias)</SelectItem>
            <SelectItem value="TXT">TXT (Text Record)</SelectItem>
            <SelectItem value="SRV">SRV (Service)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Target Value */}
      <div className="space-y-2">
        <Label htmlFor="targetValue">Target Value</Label>
        <Input
          id="targetValue"
          placeholder={placeholders[recordType]}
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          {recordType === 'A' && "Enter an IPv4 address (e.g., 192.168.1.1)"}
          {recordType === 'CNAME' && "Enter a domain name (e.g., example.com)"}
          {recordType === 'TXT' && "Enter the text content for this record"}
          {recordType === 'SRV' && "Enter priority, weight, port, and target"}
        </p>
      </div>

      {/* TTL */}
      <div className="space-y-2">
        <Label htmlFor="ttl">TTL (seconds)</Label>
        <Select value={ttl.toString()} onValueChange={(v) => setTtl(parseInt(v))}>
          <SelectTrigger id="ttl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="60">1 minute</SelectItem>
            <SelectItem value="300">5 minutes</SelectItem>
            <SelectItem value="3600">1 hour</SelectItem>
            <SelectItem value="86400">24 hours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Preview */}
      <div className="p-4 rounded-lg bg-secondary/50 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Preview</span>
        </div>
        <code className="font-mono text-sm">
          <span className="text-primary">{subdomain || 'subdomain'}</span>
          <span className="text-muted-foreground">.{domain}</span>
          <span className="text-muted-foreground mx-2">→</span>
          <span className="text-foreground">{targetValue || placeholders[recordType]}</span>
        </code>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Request"
        )}
      </Button>
    </form>
  );
}
