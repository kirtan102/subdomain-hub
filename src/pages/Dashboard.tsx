import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { RequestForm } from "@/components/RequestForm";
import { RequestCard } from "@/components/RequestCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  RefreshCw, 
  Inbox,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface SubdomainRequest {
  id: string;
  subdomain: string;
  record_type: 'A' | 'CNAME' | 'TXT' | 'SRV';
  target_value: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reason: string | null;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<SubdomainRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  async function fetchRequests() {
    setLoading(true);
    const { data, error } = await supabase
      .from('subdomain_requests')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRequests(data as SubdomainRequest[]);
    }
    setLoading(false);
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const rejectedRequests = requests.filter(r => r.status === 'rejected');

  const stats = [
    { label: 'Total Requests', value: requests.length, color: 'text-foreground' },
    { label: 'Pending', value: pendingRequests.length, color: 'text-warning' },
    { label: 'Approved', value: approvedRequests.length, color: 'text-success' },
    { label: 'Rejected', value: rejectedRequests.length, color: 'text-destructive' },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-muted-foreground">Manage your subdomain requests</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={fetchRequests} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Request Subdomain</DialogTitle>
                </DialogHeader>
                <RequestForm onSuccess={() => {
                  setDialogOpen(false);
                  fetchRequests();
                }} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="glass rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Requests */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedRequests.length})</TabsTrigger>
          </TabsList>

          {['all', 'pending', 'approved', 'rejected'].map((tab) => {
            const filteredRequests = tab === 'all' 
              ? requests 
              : requests.filter(r => r.status === tab);

            return (
              <TabsContent key={tab} value={tab} className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : filteredRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {tab === 'all' 
                        ? "No requests yet. Create your first one!" 
                        : `No ${tab} requests`}
                    </p>
                    {tab === 'all' && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setDialogOpen(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Request
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredRequests.map((request) => (
                      <RequestCard
                        key={request.id}
                        subdomain={request.subdomain}
                        recordType={request.record_type}
                        targetValue={request.target_value}
                        status={request.status}
                        createdAt={request.created_at}
                        reason={request.reason || undefined}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </main>
    </div>
  );
}
