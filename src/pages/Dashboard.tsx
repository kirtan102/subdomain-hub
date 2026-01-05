import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RequestForm } from "@/components/RequestForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useSubdomainRequests, useInvalidateSubdomainRequests } from "@/hooks/useSubdomainRequests";
import { 
  Plus, 
  Search,
  Inbox,
  Loader2,
  Pencil,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RecordTypeBadge } from "@/components/RecordTypeBadge";
import { StatusBadge } from "@/components/StatusBadge";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: requests = [], isLoading: loading } = useSubdomainRequests();
  const invalidateRequests = useInvalidateSubdomainRequests();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const filteredRequests = requests.filter(request => {
    const searchLower = searchQuery.toLowerCase();
    return (
      request.subdomain.toLowerCase().includes(searchLower) ||
      request.target_value.toLowerCase().includes(searchLower) ||
      request.record_type.toLowerCase().includes(searchLower)
    );
  });

  const formatTTL = (ttl: number) => {
    if (ttl === 1) return "Auto";
    if (ttl < 60) return `${ttl}s`;
    if (ttl < 3600) return `${Math.floor(ttl / 60)}m`;
    if (ttl < 86400) return `${Math.floor(ttl / 3600)}h`;
    return `${Math.floor(ttl / 86400)}d`;
  };

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
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            DNS Records
          </h1>
          <p className="text-muted-foreground">
            Manage your subdomain records for seeky.click
          </p>
        </motion.div>

        {/* Search and Add Record Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search DNS Records"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-secondary/30 border-border/50 rounded-lg focus:border-primary/50"
              />
            </div>
            <Button 
              variant="outline"
              onClick={() => setSearchQuery("")}
              disabled={!searchQuery}
              className="h-11 px-5 rounded-lg border-border/50 hover:border-foreground/30"
            >
              Search
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-11 px-5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add record
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md border-border/50 bg-background/95 backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="text-xl">Add DNS Record</DialogTitle>
                </DialogHeader>
                <RequestForm onSuccess={() => {
                  setDialogOpen(false);
                  invalidateRequests();
                }} />
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* DNS Records Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl border border-border/50 overflow-hidden bg-secondary/10"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-foreground/50" />
                <p className="text-muted-foreground">Loading records...</p>
              </div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-5">
                <Inbox className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? "No matching records" : "No DNS records yet"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                {searchQuery 
                  ? "Try a different search term." 
                  : "Get started by adding your first DNS record."}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setDialogOpen(true)}
                  className="h-11 px-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add your first record
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-medium">Type</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Name</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Content</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                  <TableHead className="text-muted-foreground font-medium">TTL</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request, index) => (
                  <motion.tr
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    <TableCell>
                      <RecordTypeBadge type={request.record_type} />
                    </TableCell>
                    <TableCell>
                      <code className="font-mono text-sm text-foreground">
                        {request.subdomain}
                      </code>
                    </TableCell>
                    <TableCell>
                      <code className="font-mono text-sm text-muted-foreground">
                        {request.target_value}
                      </code>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatTTL(request.ttl)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80 hover:bg-transparent p-0 h-auto font-medium"
                      >
                        <Pencil className="w-3.5 h-3.5 mr-1.5" />
                        Edit
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </motion.div>

        {/* Records count */}
        {!loading && filteredRequests.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground mt-4"
          >
            Showing {filteredRequests.length} of {requests.length} records
          </motion.p>
        )}
      </main>

      <Footer />
    </div>
  );
}
