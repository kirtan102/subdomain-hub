import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CheckSubdomainRequest {
    subdomain: string
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { subdomain }: CheckSubdomainRequest = await req.json()
        const cleanSubdomain = subdomain?.toLowerCase().trim()

        if (!cleanSubdomain || cleanSubdomain.length < 3) {
            throw new Error('Invalid subdomain')
        }

        console.log(`Checking availability for: ${cleanSubdomain}`)

        // Parallelize checks for performance
        const cloudflareToken = Deno.env.get('CLOUDFLARE_API_TOKEN')
        const zoneId = Deno.env.get('CLOUDFLARE_ZONE_ID')
        const baseDomain = Deno.env.get('BASE_DOMAIN') || 'seeky.click'

        if (!cloudflareToken || !zoneId) {
            throw new Error('Missing Cloudflare configuration')
        }

        const fqdn = `${cleanSubdomain}.${baseDomain}`
        console.log(`Checking availability for: ${cleanSubdomain}`)

        const [dbResult, cfResult] = await Promise.all([
            // Task 1: Check Database
            (async () => {
                const { count, error } = await supabaseClient
                    .from('subdomain_requests')
                    .select('*', { count: 'exact', head: true })
                    .eq('subdomain', cleanSubdomain)

                if (error) throw error
                return count && count > 0
            })(),

            // Task 2: Check Cloudflare
            (async () => {
                const res = await fetch(
                    `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?name=${fqdn}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${cloudflareToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                )
                const data = await res.json()
                if (!data.success) throw new Error('Failed to query Cloudflare')
                const records = data.result
                return records && records.length > 0
            })()
        ])

        if (dbResult) {
            console.log(`Found in DB: ${cleanSubdomain}`)
            return new Response(
                JSON.stringify({ available: false, source: 'database' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
            )
        }

        if (cfResult) {
            console.log(`Found in Cloudflare: ${fqdn}`)
            return new Response(
                JSON.stringify({ available: false, source: 'cloudflare' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
            )
        }

        // 3. Available
        console.log(`Available: ${cleanSubdomain}`)
        return new Response(
            JSON.stringify({ available: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error: any) {
        console.error('Error checking subdomain:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
