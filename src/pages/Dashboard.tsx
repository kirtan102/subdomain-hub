import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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
  Clock,
  CheckCircle2,
  XCircle,
  LayoutGrid,
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
    { 
      label: 'Total Requests', 
      value: requests.length, 
      icon: LayoutGrid,
      gradient: 'from-blue-500/20 to-purple-500/20',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400'
    },
    { 
      label: 'Pending', 
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

  if (authLoading) {
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
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Welcome back! Manage your subdomain requests here.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline" 
                onClick={fetchRequests} 
                disabled={loading}
                className="h-11 px-5 rounded-xl border-border/50 hover:border-foreground/30 transition-all"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </motion.div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="h-11 px-5 rounded-xl bg-foreground text-background hover:bg-foreground/90">
                    <Plus className="w-4 h-4 mr-2" />
                    New Request
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md border-border/50 bg-background/95 backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="text-xl">Request Subdomain</DialogTitle>
                </DialogHeader>
                <RequestForm onSuccess={() => {
                  setDialogOpen(false);
                  fetchRequests();
                }} />
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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
              
              {/* Decorative gradient orb */}
              <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${stat.gradient} blur-2xl opacity-50`} />
            </motion.div>
          ))}
        </div>

        {/* Requests Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="bg-secondary/50 border border-border/30 p-1 rounded-xl">
              <TabsTrigger 
                value="all" 
                className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-background transition-all"
              >
                All ({requests.length})
              </TabsTrigger>
              <TabsTrigger 
                value="pending"
                className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-background transition-all"
              >
                Pending ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger 
                value="approved"
                className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-background transition-all"
              >
                Approved ({approvedRequests.length})
              </TabsTrigger>
              <TabsTrigger 
                value="rejected"
                className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-background transition-all"
              >
                Rejected ({rejectedRequests.length})
              </TabsTrigger>
            </TabsList>

            {['all', 'pending', 'approved', 'rejected'].map((tab) => {
              const filteredRequests = tab === 'all' 
                ? requests 
                : requests.filter(r => r.status === tab);

              return (
                <TabsContent key={tab} value={tab} className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-foreground/50" />
                        <p className="text-muted-foreground">Loading requests...</p>
                      </div>
                    </div>
                  ) : filteredRequests.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-20 rounded-2xl border border-dashed border-border/50 bg-secondary/20"
                    >
                      <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-5">
                        <Inbox className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {tab === 'all' 
                          ? "No requests yet" 
                          : `No ${tab} requests`}
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                        {tab === 'all' 
                          ? "Get started by creating your first subdomain request." 
                          : `You don't have any ${tab} requests at the moment.`}
                      </p>
                      {tab === 'all' && (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button 
                            onClick={() => setDialogOpen(true)}
                            className="h-11 px-6 rounded-xl bg-foreground text-background hover:bg-foreground/90"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Request
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="grid gap-4">
                      {filteredRequests.map((request, index) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <RequestCard
                            subdomain={request.subdomain}
                            recordType={request.record_type}
                            targetValue={request.target_value}
                            status={request.status}
                            createdAt={request.created_at}
                            reason={request.reason || undefined}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
