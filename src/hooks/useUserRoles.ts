import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

async function fetchUserAdminRole(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .maybeSingle();
  
  return !!data;
}

export function useIsAdmin(userId: string | undefined) {
  return useQuery({
    queryKey: ['userRoles', userId, 'admin'],
    queryFn: () => fetchUserAdminRole(userId!),
    enabled: !!userId,
    staleTime: STALE_TIME,
  });
}
