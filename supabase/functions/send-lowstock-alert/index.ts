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
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get all owners with email alerts enabled
    const { data: owners, error: ownersError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, full_name, tenant_id, email_alerts_enabled')
      .eq('role', 'owner')
      .eq('email_alerts_enabled', true);

    if (ownersError) throw ownersError;

    console.log(`Processing ${owners?.length ?? 0} owners`);
    const results = [];

    for (const owner of owners ?? []) {
      // Get low stock products for this owner's tenant
      const { data: allProducts } = await supabaseAdmin
        .from('products')
        .select('name, stock, "minStock", category')
        .eq('tenant_id', owner.tenant_id);

      const lowStock = (allProducts ?? []).filter((p: any) => p.stock <= p.minStock);

      if (lowStock.length === 0) {
        results.push({ owner: owner.email, status: 'no_alerts_needed' });
        continue;
      }

      // Build email HTML
      const productRows = lowStock.map((p: any) => `
        <tr>
          <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#1e293b">
            ${p.name}${p.category ? ` <span style="font-size:12px;color:#64748b">(${p.category})</span>` : ''}
          </td>
          <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;text-align:center">
            <span style="background:#fee2e2;color:#ef4444;padding:3px 10px;border-radius:6px;font-size:13px;font-weight:700">
              ${p.stock} restants
            </span>
          </td>
          <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;text-align:center;font-size:13px;color:#64748b">
            Min: ${p.minStock}
          </td>
        </tr>
      `).join('');

      const firstName = owner.full_name?.split(' ')[0] || 'cher utilisateur';

      const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px">

    <!-- Header -->
    <div style="background:#2563eb;border-radius:16px 16px 0 0;padding:24px 28px;text-align:center">
      <h1 style="margin:0;color:white;font-size:22px;font-weight:800;letter-spacing:-0.5px">
        StockAlert
      </h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px">
        Alerte stock bas — ${new Date().toLocaleDateString('fr-FR', {weekday:'long',day:'numeric',month:'long'})}
      </p>
    </div>

    <!-- Body -->
    <div style="background:white;border-radius:0 0 16px 16px;padding:28px;border:1px solid #e2e8f0;border-top:none">

      <p style="margin:0 0 6px;font-size:16px;color:#0f172a">
        Bonjour <strong>${firstName}</strong>,
      </p>
      <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6">
        <strong style="color:#ef4444">${lowStock.length} produit${lowStock.length > 1 ? 's' : ''}</strong>
        ${lowStock.length > 1 ? 'ont besoin' : 'a besoin'} d'être réapprovisionné${lowStock.length > 1 ? 's' : ''} :
      </p>

      <!-- Products table -->
      <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
        <thead>
          <tr style="background:#f8fafc">
            <th style="padding:10px 16px;text-align:left;font-size:12px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Produit</th>
            <th style="padding:10px 16px;text-align:center;font-size:12px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Stock</th>
            <th style="padding:10px 16px;text-align:center;font-size:12px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Seuil</th>
          </tr>
        </thead>
        <tbody>${productRows}</tbody>
      </table>

      <!-- CTA -->
      <div style="text-align:center;margin-top:28px">
        <a href="https://stockalert-tawny.vercel.app"
          style="display:inline-block;padding:14px 32px;background:#2563eb;color:white;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px">
          Mettre à jour mon stock
        </a>
      </div>

      <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;text-align:center;line-height:1.6">
        Vous recevez cet email parce que vous avez activé les alertes sur StockAlert.<br/>
        Cet email est envoyé automatiquement chaque soir à 18h si du stock est bas.
      </p>
    </div>

    <p style="text-align:center;margin-top:16px;font-size:12px;color:#94a3b8">
      © ${new Date().getFullYear()} StockAlert · Abidjan, Côte d'Ivoire
    </p>
  </div>
</body>
</html>`;

      // Send email using Resend
      const resendApiKey = Deno.env.get('RESEND_API_KEY');

      if (!resendApiKey) {
        console.log('No RESEND_API_KEY — set it in Edge Function secrets');
        results.push({ owner: owner.email, status: 'no_email_service_configured' });
        continue;
      }

      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'StockAlert <alerts@yourdomain.com>',
          to: [owner.email],
          subject: `⚠️ ${lowStock.length} produit${lowStock.length > 1 ? 's' : ''} en stock bas — StockAlert`,
          html: emailHtml,
        }),
      });

      const emailResult = await emailResponse.json();
      results.push({
        owner: owner.email,
        products: lowStock.length,
        status: emailResponse.ok ? 'sent' : 'failed',
        error: emailResult.message,
      });
    }

    return new Response(
      JSON.stringify({ success: true, processed: results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Email alerts error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
