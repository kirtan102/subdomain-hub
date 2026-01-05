import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface SubdomainRequest {
  id: string;
  subdomain: string;
  record_type: 'A' | 'CNAME' | 'TXT' | 'SRV';
  target_value: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  ttl: number;
  reason: string | null;
  user_id: string;
  profiles?: {
    email: string;
    full_name: string | null;
  };
}

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

async function fetchUserRequests(userId: string): Promise<SubdomainRequest[]> {
  const { data, error } = await supabase
    .from('subdomain_requests')
    .select('*')
    .eq('user_id', userId)
    .neq('status', 'rejected') // Hide rejected requests from user dashboard
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as SubdomainRequest[];
}

async function fetchAllRequests(): Promise<SubdomainRequest[]> {
  const { data, error } = await supabase
    .from('subdomain_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Fetch profiles for all users
  const userIds = [...new Set(data.map(r => r.user_id))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .in('id', userIds);

  const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

  return data.map(r => ({
    ...r,
    profiles: profileMap.get(r.user_id) || undefined,
  })) as SubdomainRequest[];
}

export function useSubdomainRequests() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['subdomainRequests', user?.id],
    queryFn: () => fetchUserRequests(user!.id),
    enabled: !!user,
    staleTime: STALE_TIME,
  });
}

export function useAllSubdomainRequests() {
  const { user, isAdmin } = useAuth();

  return useQuery({
    queryKey: ['subdomainRequests', 'admin'],
    queryFn: fetchAllRequests,
    enabled: !!user && isAdmin,
    staleTime: STALE_TIME,
  });
}

export function useInvalidateSubdomainRequests() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['subdomainRequests'] });
  };
}
