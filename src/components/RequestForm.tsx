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
import { Loader2, Globe, Check, X, AlertCircle, Lock } from "lucide-react";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { useSubscription } from "@/hooks/useSubscription";

const subdomainSchema = z.object({
  subdomain: z.string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(63, "Subdomain must be 63 characters or less")
    .regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, "Only lowercase letters, numbers, and hyphens allowed"),
  recordType: z.enum(['A', 'CNAME', 'TXT', 'SRV', 'MX']),
  targetValue: z.string().min(1, "Target value is required").max(255, "Target value too long"),
  ttl: z.number().min(60).max(86400),
});

interface RequestFormProps {
  onSuccess?: () => void;
  domain?: string;
}

export function RequestForm({ onSuccess, domain = "seeky.click" }: RequestFormProps) {
  const { user } = useAuth();
  const { isPro, isLoading: subscriptionLoading } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [subdomain, setSubdomain] = useState("");
  const [recordType, setRecordType] = useState<'A' | 'CNAME' | 'TXT' | 'SRV' | 'MX'>('A');
  const [targetValue, setTargetValue] = useState("");
  const [ttl, setTtl] = useState(3600);

  const debouncedSubdomain = useDebounce(subdomain, 1200);

  const placeholders = {
    A: "192.168.1.1",
    CNAME: "example.com",
    TXT: "v=spf1 include:example.com ~all",
    SRV: "0 5 5269 xmpp.example.com",
    MX: "10 mail.example.com",
  };

  const isTooShort = subdomain.length > 0 && subdomain.length < 3;

  const { data: isAvailable, isLoading: checkingAvailability } = useQuery({
    queryKey: ['subdomain-check', debouncedSubdomain],
    queryFn: async ({ signal }) => {
      // Logic requirement: NEVER fire if length < 3
      if (!debouncedSubdomain || debouncedSubdomain.length < 3) return null;

      const { data, error } = await supabase.functions.invoke('check-subdomain', {
        body: { subdomain: debouncedSubdomain }
      });

      if (error) throw error;
      return data.available;
    },
    enabled: debouncedSubdomain.length >= 3,
    staleTime: 60 * 1000,
  });

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sanitization: Lowercase and remove invalid characters immediately
    const sanitized = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(sanitized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to submit a request");
      return;
    }

    // Additional client-side check for plan restrictions
    if (!isPro) {
      if (recordType === 'TXT' || recordType === 'SRV' || recordType === 'MX') {
        toast.error("Upgrade to Pro to use this record type");
        return;
      }
      if (ttl !== 3600) {
        toast.error("Upgrade to Pro to use custom TTL");
        return;
      }
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

    if (isAvailable === false) {
      toast.error("This subdomain is already taken");
      return;
    }

    if (subdomain.length < 3) {
      toast.error("Subdomain must be at least 3 characters");
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
      // Handle the trigger exception message
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
        <div className="flex items-stretch">
          <div className="relative flex-1">
            <Input
              id="subdomain"
              placeholder="myserver"
              value={subdomain}
              onChange={handleSubdomainChange}
              className="rounded-r-none border-r-0 focus-visible:z-10 pr-10"
            />
            {subdomain && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checkingAvailability ? (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : !isTooShort && isAvailable === true ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : !isTooShort && isAvailable === false ? (
                  <X className="w-4 h-4 text-red-500" />
                ) : null}
              </div>
            )}
          </div>
          <div className="px-4 flex items-center bg-muted border border-input border-l-0 rounded-r-md">
            <span className="text-muted-foreground font-mono text-sm">.{domain}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 h-5">
          {/* using h-5 to reserve space so layout doesn't jump too much */}
          {isTooShort ? (
            <p className="text-xs text-yellow-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Subdomain must be at least 3 characters
            </p>
          ) : subdomain && !checkingAvailability && isAvailable === false ? (
            <p className="text-xs text-red-500">This subdomain is already taken</p>
          ) : subdomain && !checkingAvailability && isAvailable === true ? (
            <p className="text-xs text-green-500">Available!</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Lowercase letters, numbers, and hyphens only
            </p>
          )}
        </div>
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

            <SelectItem value="TXT" disabled={!isPro} className="flex justify-between items-center group">
              <span className="flex items-center w-full justify-between">
                TXT (Text Record)
                {!isPro && <Lock className="w-3 h-3 ml-2 text-muted-foreground" />}
              </span>
            </SelectItem>

            <SelectItem value="SRV" disabled={!isPro} className="flex justify-between items-center group">
              <span className="flex items-center w-full justify-between">
                SRV (Service)
                {!isPro && <Lock className="w-3 h-3 ml-2 text-muted-foreground" />}
              </span>
            </SelectItem>

            <SelectItem value="MX" disabled={!isPro} className="flex justify-between items-center group">
              <span className="flex items-center w-full justify-between">
                MX (Mail Exchange)
                {!isPro && <Lock className="w-3 h-3 ml-2 text-muted-foreground" />}
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
        {!isPro && (recordType === 'TXT' || recordType === 'SRV' || recordType === 'MX') && (
          <p className="text-xs text-amber-500 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Upgrade to Pro to use this record type
          </p>
        )}
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
          {recordType === 'MX' && "Enter priority and mail server (e.g., 10 mail.example.com)"}
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
            <SelectItem value="60" disabled={!isPro} className="flex justify-between items-center group">
              <span className="flex items-center w-full justify-between">
                1 minute
                {!isPro && <Lock className="w-3 h-3 ml-2 text-muted-foreground" />}
              </span>
            </SelectItem>
            <SelectItem value="300" disabled={!isPro} className="flex justify-between items-center group">
              <span className="flex items-center w-full justify-between">
                5 minutes
                {!isPro && <Lock className="w-3 h-3 ml-2 text-muted-foreground" />}
              </span>
            </SelectItem>
            <SelectItem value="3600">1 hour</SelectItem>
            <SelectItem value="86400" disabled={!isPro} className="flex justify-between items-center group">
              <span className="flex items-center w-full justify-between">
                24 hours
                {!isPro && <Lock className="w-3 h-3 ml-2 text-muted-foreground" />}
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
        {!isPro && ttl !== 3600 && (
          <p className="text-xs text-amber-500 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Upgrade to Pro to use custom TTL
          </p>
        )}
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

      <Button
        type="submit"
        className="w-full"
        disabled={
          loading ||
          isTooShort ||
          isAvailable !== true ||
          checkingAvailability ||
          subdomain !== debouncedSubdomain
        }
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : checkingAvailability || subdomain !== debouncedSubdomain ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Checking Availability...
          </>
        ) : (
          "Submit Request"
        )}
      </Button>
    </form>
  );
}
