import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DeleteDnsRequest {
    requestId: string
}

Deno.serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Verify user is authenticated
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('Missing authorization header')
        }

        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)

        if (userError || !user) {
            throw new Error('Unauthorized')
        }

        const { requestId }: DeleteDnsRequest = await req.json()

        console.log('Deleting DNS record for request:', requestId)

        // 1. Get the Cloudflare Record ID
        const { data: recordData, error: recordError } = await supabaseClient
            .from('dns_records')
            .select('cloudflare_record_id, request_id, subdomain_requests!inner(user_id)')
            .eq('request_id', requestId)
            .single()

        if (recordError || !recordData) {
            console.warn('DNS record not found in logs, attempting to delete request directly:', recordError)
        }

        // 2. Verify Ownership (Security Check)
        // Optimization: Use the user_id joined from the first query if available
        let requestUserId = recordData?.subdomain_requests?.user_id

        // Fallback if not found in dns_records (e.g. pending request)
        if (!requestUserId) {
            const { data: requestData, error: requestError } = await supabaseClient
                .from('subdomain_requests')
                .select('user_id')
                .eq('id', requestId)
                .maybeSingle()

            if (requestError || !requestData) {
                throw new Error('[Lookup Failed] Request not found with specified id')
            }
            requestUserId = requestData.user_id
        }

        // Allow admins to delete anything
        const { data: roleData } = await supabaseClient
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .single()

        if (requestUserId !== user.id && roleData?.role !== 'admin') {
            throw new Error(`[Permission Denied] You do not have permission (Owner: ${requestUserId}, User: ${user.id})`)
        }

        // 3. Parallelize Deletion (Cloudflare + Supabase)
        const deletePromises = []

        // Task A: Delete from Cloudflare
        if (recordData?.cloudflare_record_id) {
            deletePromises.push((async () => {
                const cloudflareToken = Deno.env.get('CLOUDFLARE_API_TOKEN')
                const zoneId = Deno.env.get('CLOUDFLARE_ZONE_ID')

                if (!cloudflareToken || !zoneId) return

                console.log(`Deleting from Cloudflare: ${recordData.cloudflare_record_id}`)
                try {
                    const cloudflareResponse = await fetch(
                        `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordData.cloudflare_record_id}`,
                        {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${cloudflareToken}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    )
                    const cloudflareData = await cloudflareResponse.json()
                    if (!cloudflareData.success) {
                        console.error('Failed to delete from Cloudflare:', cloudflareData.errors)
                    }
                } catch (err) {
                    console.error('Cloudflare API error:', err)
                }
            })())
        }

        // Task B: Delete from Supabase
        deletePromises.push((async () => {
            const { error: deleteError } = await supabaseClient
                .from('subdomain_requests')
                .delete()
                .eq('id', requestId)

            if (deleteError) {
                throw new Error('[Delete Failed] Failed to delete request from database: ' + deleteError.message)
            }
        })())

        await Promise.all(deletePromises)

        return new Response(
            JSON.stringify({
                success: true,
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('Error deleting DNS record:', error)

        // Return 200 with error info to bypass client "non-2xx" exception
        return new Response(
            JSON.stringify({ success: false, error: errorMessage }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )
    }
})
