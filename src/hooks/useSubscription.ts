import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

export function useSubscription() {
    const { user } = useAuth();

    const { data: plan, isLoading } = useQuery({
        queryKey: ['subscription', user?.id],
        queryFn: async () => {
            if (!user) return 'free';

            const { data, error } = await supabase
                .from('subscriptions')
                .select('plan')
                .eq('user_id', user.id)
                .maybeSingle();

            if (error) {
                console.error('Error fetching subscription:', error);
                return 'free';
            }

            return (data?.plan as SubscriptionPlan) || 'free';
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        plan: plan || 'free',
        isLoading,
        isPro: plan === 'pro' || plan === 'enterprise',
        isEnterprise: plan === 'enterprise'
    };
}
