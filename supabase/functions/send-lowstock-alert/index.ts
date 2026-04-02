import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get all owner profiles that have a WhatsApp number configured
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, full_name, tenant_id, whatsapp_number, callmebot_apikey')
      .eq('role', 'owner')
      .not('whatsapp_number', 'is', null)
      .not('callmebot_apikey', 'is', null);

    if (profilesError) throw profilesError;

    console.log(`Found ${profiles?.length ?? 0} owners with WhatsApp configured`);

    const results = [];

    for (const profile of profiles ?? []) {
      // Get low stock products for this tenant
      const { data: lowProducts, error: lowError } = await supabase
        .from('products')
        .select('name, stock, "minStock", category')
        .eq('tenant_id', profile.tenant_id);

      if (lowError) {
        console.error(`Error fetching products for ${profile.id}:`, lowError);
        continue;
      }

      // Filter in JS since Supabase doesn't support column-to-column comparison
      const alerts = (lowProducts ?? []).filter((p: { stock: number; minStock: number }) => p.stock <= p.minStock);

      if (alerts.length === 0) {
        console.log(`No low stock for tenant ${profile.tenant_id}`);
        continue;
      }

      // Build the WhatsApp message
      const productList = alerts
        .map((p: { name: string; category?: string; stock: number }) => `• ${p.name}${p.category ? ` (${p.category})` : ''}: ${p.stock} restants`)
        .join('\n');

      const message = `⚠️ *STOCKALERT - Stock Bas*\n\n${alerts.length} produit(s) à réapprovisionner:\n\n${productList}\n\n_Reconnectez-vous sur StockAlert pour mettre à jour votre stock._`;

      // URL encode the message for CallMeBot
      const encodedMessage = encodeURIComponent(message);
      const callMeBotUrl = `https://api.callmebot.com/whatsapp.php?phone=${profile.whatsapp_number}&text=${encodedMessage}&apikey=${profile.callmebot_apikey}`;

      // Send via CallMeBot
      const whatsappResponse = await fetch(callMeBotUrl);
      const responseText = await whatsappResponse.text();

      console.log(`WhatsApp sent to ${profile.whatsapp_number}: ${whatsappResponse.status}`);

      results.push({
        owner: profile.id,
        phone: profile.whatsapp_number,
        alertCount: alerts.length,
        status: whatsappResponse.ok ? 'sent' : 'failed',
        response: responseText,
      });
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
