import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { StatusBadge } from "@/components/StatusBadge";
import { RecordTypeBadge } from "@/components/RecordTypeBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Check, 
  X, 
  Loader2, 
  RefreshCw,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SubdomainRequest {
  id: string;
  subdomain: string;
  record_type: 'A' | 'CNAME' | 'TXT' | 'SRV';
  target_value: string;
  ttl: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reason: string | null;
  user_id: string;
  profiles?: {
    email: string;
    full_name: string | null;
  };
}

export default function Admin() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<SubdomainRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SubdomainRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        navigate('/dashboard');
        toast.error("You don't have admin access");
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchRequests();
    }
  }, [isAdmin]);

  async function fetchRequests() {
    setLoading(true);
    const { data, error } = await supabase
      .from('subdomain_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Fetch profiles separately
      const userIds = [...new Set(data.map(r => r.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      const requestsWithProfiles = data.map(r => ({
        ...r,
        profiles: profileMap.get(r.user_id) || undefined,
      }));
      
      setRequests(requestsWithProfiles as SubdomainRequest[]);
    }
    setLoading(false);
  }

  async function handleApprove(request: SubdomainRequest) {
    setActionLoading(request.id);

    try {
      // Call edge function to create DNS record
      const { data, error } = await supabase.functions.invoke('create-dns-record', {
        body: {
          requestId: request.id,
          subdomain: request.subdomain,
          recordType: request.record_type,
          targetValue: request.target_value,
          ttl: request.ttl,
        },
      });

      if (error) throw error;

      // Update request status
      const { error: updateError } = await supabase
        .from('subdomain_requests')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: user?.id,
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      toast.success(`Approved ${request.subdomain}.yourdomain.com`);
      fetchRequests();
    } catch (error: any) {
      toast.error(error.message || "Failed to approve request");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject() {
    if (!selectedRequest) return;
    
    setActionLoading(selectedRequest.id);

    try {
      const { error } = await supabase
        .from('subdomain_requests')
        .update({
          status: 'rejected',
          reason: rejectReason || 'Request rejected by admin',
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      toast.success(`Rejected ${selectedRequest.subdomain}.yourdomain.com`);
      setRejectDialogOpen(false);
      setRejectReason("");
      setSelectedRequest(null);
      fetchRequests();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject request");
    } finally {
      setActionLoading(null);
    }
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const stats = {
    total: requests.length,
    pending: pendingRequests.length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground">Manage subdomain requests</p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={fetchRequests} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Requests</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="glass rounded-lg p-4 border-warning/30">
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-2xl font-bold text-warning">{stats.pending}</p>
          </div>
          <div className="glass rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Approved</p>
            <p className="text-2xl font-bold text-success">{stats.approved}</p>
          </div>
          <div className="glass rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Rejected</p>
            <p className="text-2xl font-bold text-destructive">{stats.rejected}</p>
          </div>
        </div>

        {/* Pending Alert */}
        {stats.pending > 0 && (
          <div className="flex items-center gap-3 p-4 mb-6 rounded-lg bg-warning/10 border border-warning/30">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <p className="text-sm">
              <span className="font-medium">{stats.pending} request(s)</span> pending review
            </p>
          </div>
        )}

        {/* Requests Table */}
        <div className="glass rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Subdomain</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No requests found
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id} className="border-border">
                    <TableCell>
                      <code className="font-mono text-sm">
                        <span className="text-primary">{request.subdomain}</span>
                        <span className="text-muted-foreground">.yourdomain.com</span>
                      </code>
                    </TableCell>
                    <TableCell>
                      <RecordTypeBadge type={request.record_type} />
                    </TableCell>
                    <TableCell>
                      <code className="font-mono text-sm text-muted-foreground">
                        {request.target_value.length > 30 
                          ? `${request.target_value.slice(0, 30)}...` 
                          : request.target_value}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{request.profiles?.email || 'Unknown'}</p>
                        {request.profiles?.full_name && (
                          <p className="text-muted-foreground text-xs">
                            {request.profiles.full_name}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      {request.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-success hover:text-success hover:bg-success/10"
                            onClick={() => handleApprove(request)}
                            disabled={actionLoading === request.id}
                          >
                            {actionLoading === request.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              setSelectedRequest(request);
                              setRejectDialogOpen(true);
                            }}
                            disabled={actionLoading === request.id}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to reject{" "}
              <code className="font-mono text-primary">
                {selectedRequest?.subdomain}.yourdomain.com
              </code>?
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason (optional)</label>
              <Textarea
                placeholder="Enter a reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={actionLoading === selectedRequest?.id}
            >
              {actionLoading === selectedRequest?.id ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
