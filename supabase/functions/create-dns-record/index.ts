import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateDnsRequest {
  requestId: string
  subdomain: string
  recordType: 'A' | 'CNAME' | 'TXT' | 'SRV'
  targetValue: string
  ttl: number
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

    // Verify user is admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single()

    if (roleError || !roleData) {
      throw new Error('Admin access required')
    }

    const { requestId, subdomain, recordType, targetValue, ttl }: CreateDnsRequest = await req.json()

    console.log('Creating DNS record:', { requestId, subdomain, recordType, targetValue, ttl })

    const cloudflareToken = Deno.env.get('CLOUDFLARE_API_TOKEN')
    const zoneId = Deno.env.get('CLOUDFLARE_ZONE_ID')
    const baseDomain = Deno.env.get('BASE_DOMAIN')

    if (!cloudflareToken || !zoneId || !baseDomain) {
      throw new Error('Missing Cloudflare configuration')
    }

    const fqdn = `${subdomain}.${baseDomain}`

    // Create DNS record in Cloudflare
    const cloudflareResponse = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cloudflareToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: recordType,
          name: fqdn,
          content: targetValue,
          ttl: ttl,
          proxied: false,
        }),
      }
    )

    const cloudflareData = await cloudflareResponse.json()
    console.log('Cloudflare response:', cloudflareData)

    if (!cloudflareData.success) {
      const errorMsg = cloudflareData.errors?.[0]?.message || 'Failed to create DNS record'
      throw new Error(errorMsg)
    }

    const cloudflareRecordId = cloudflareData.result.id

    // Store DNS record in database
    const { error: insertError } = await supabaseClient
      .from('dns_records')
      .insert({
        request_id: requestId,
        fqdn: fqdn,
        record_type: recordType,
        target_value: targetValue,
        ttl: ttl,
        cloudflare_record_id: cloudflareRecordId,
      })

    if (insertError) {
      console.error('Database insert error:', insertError)
      // Note: DNS record was created in Cloudflare, but we failed to record it
      // You may want to implement cleanup logic here
      throw new Error('Failed to save DNS record to database')
    }

    console.log('DNS record created successfully:', { fqdn, cloudflareRecordId })

    return new Response(
      JSON.stringify({ 
        success: true, 
        fqdn,
        cloudflareRecordId,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error creating DNS record:', error)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
