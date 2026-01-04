import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StatusBadge } from "@/components/StatusBadge";
import { RecordTypeBadge } from "@/components/RecordTypeBadge";
import { Button } from "@/components/ui/button";
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
import { useAllSubdomainRequests, useInvalidateSubdomainRequests } from "@/hooks/useSubdomainRequests";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Check, 
  X, 
  Loader2, 
  RefreshCw,
  Shield,
  AlertTriangle,
  LayoutGrid,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { SubdomainRequest } from "@/hooks/useSubdomainRequests";

export default function Admin() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SubdomainRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: requests = [], isLoading: loading, refetch } = useAllSubdomainRequests();
  const invalidateRequests = useInvalidateSubdomainRequests();

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

  async function handleApprove(request: SubdomainRequest) {
    setActionLoading(request.id);

    try {
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

      const { error: updateError } = await supabase
        .from('subdomain_requests')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: user?.id,
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      toast.success(`Approved ${request.subdomain}.seeky.click`);
      invalidateRequests();
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

      toast.success(`Rejected ${selectedRequest.subdomain}.seeky.click`);
      setRejectDialogOpen(false);
      setRejectReason("");
      setSelectedRequest(null);
      invalidateRequests();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject request");
    } finally {
      setActionLoading(null);
    }
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const rejectedRequests = requests.filter(r => r.status === 'rejected');
  const uniqueUsers = new Set(requests.map(r => r.user_id)).size;

  const stats = [
    { 
      label: 'Total Requests', 
      value: requests.length, 
      icon: LayoutGrid,
      gradient: 'from-blue-500/20 to-purple-500/20',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400'
    },
    { 
      label: 'Pending Review', 
      value: pendingRequests.length, 
      icon: Clock,
      gradient: 'from-yellow-500/20 to-orange-500/20',
      borderColor: 'border-yellow-500/30',
      iconColor: 'text-yellow-400'
    },
    { 
      label: 'Approved', 
      value: approvedRequests.length, 
      icon: CheckCircle2,
      gradient: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30',
      iconColor: 'text-green-400'
    },
    { 
      label: 'Rejected', 
      value: rejectedRequests.length, 
      icon: XCircle,
      gradient: 'from-red-500/20 to-pink-500/20',
      borderColor: 'border-red-500/30',
      iconColor: 'text-red-400'
    },
  ];

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 pt-28 pb-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10"
        >
          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center"
            >
              <Shield className="w-7 h-7 text-purple-400" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-muted-foreground text-lg">
                Review and manage subdomain requests
              </p>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="outline" 
              onClick={() => refetch()} 
              disabled={loading}
              className="h-11 px-5 rounded-xl border-border/50 hover:border-foreground/30 transition-all"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`relative overflow-hidden rounded-2xl border ${stat.borderColor} bg-gradient-to-br ${stat.gradient} p-5 backdrop-blur-sm`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl bg-background/50 ${stat.iconColor}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${stat.gradient} blur-2xl opacity-50`} />
            </motion.div>
          ))}
        </div>

        {/* Pending Alert */}
        {pendingRequests.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex items-center gap-3 p-4 mb-8 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30"
          >
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-sm">
              <span className="font-semibold text-yellow-400">{pendingRequests.length} request(s)</span>
              <span className="text-muted-foreground"> pending your review</span>
            </p>
          </motion.div>
        )}

        {/* Requests Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl border border-border/50 bg-secondary/20 backdrop-blur-sm overflow-hidden"
        >
          <div className="p-5 border-b border-border/50">
            <h2 className="text-lg font-semibold">All Requests</h2>
            <p className="text-sm text-muted-foreground">Manage and review subdomain requests from users</p>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-medium">Subdomain</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Type</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Target</TableHead>
                  <TableHead className="text-muted-foreground font-medium">User</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Created</TableHead>
                  <TableHead className="text-right text-muted-foreground font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-foreground/50" />
                        <p className="text-muted-foreground">Loading requests...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-secondary/50 flex items-center justify-center">
                          <LayoutGrid className="w-7 h-7 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">No requests found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request, index) => (
                    <motion.tr
                      key={request.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className="border-border/30 hover:bg-secondary/30 transition-colors"
                    >
                      <TableCell>
                        <code className="font-mono text-sm">
                          <span className="text-foreground font-medium">{request.subdomain}</span>
                          <span className="text-muted-foreground">.seeky.click</span>
                        </code>
                      </TableCell>
                      <TableCell>
                        <RecordTypeBadge type={request.record_type} />
                      </TableCell>
                      <TableCell>
                        <code className="font-mono text-sm text-muted-foreground">
                          {request.target_value.length > 25 
                            ? `${request.target_value.slice(0, 25)}...` 
                            : request.target_value}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-400">
                              {(request.profiles?.email?.[0] || 'U').toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm">
                            <p className="font-medium">{request.profiles?.email || 'Unknown'}</p>
                            {request.profiles?.full_name && (
                              <p className="text-muted-foreground text-xs">
                                {request.profiles.full_name}
                              </p>
                            )}
                          </div>
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
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                className="h-9 w-9 p-0 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 hover:text-green-300"
                                onClick={() => handleApprove(request)}
                                disabled={actionLoading === request.id}
                              >
                                {actionLoading === request.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                className="h-9 w-9 p-0 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setRejectDialogOpen(true);
                                }}
                                disabled={actionLoading === request.id}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          </div>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </main>

      <Footer />

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md border-border/50 bg-background/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Reject Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to reject{" "}
              <code className="font-mono text-foreground font-medium">
                {selectedRequest?.subdomain}.seeky.click
              </code>?
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason (optional)</label>
              <Textarea
                placeholder="Enter a reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="rounded-xl border-border/50 bg-secondary/30 focus:border-foreground/30"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setRejectDialogOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReject}
              disabled={actionLoading === selectedRequest?.id}
              className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300"
            >
              {actionLoading === selectedRequest?.id ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
