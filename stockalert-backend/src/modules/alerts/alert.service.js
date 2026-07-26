const prisma = require('../../config/database');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

class AlertService {
  async sendLowStockAlerts() {
    const users = await prisma.user.findMany({
      where: {
        emailAlertsEnabled: true,
      },
      select: {
        id: true,
        email: true,
        tenantId: true,
      },
    });

    for (const user of users) {
      const products = await prisma.product.findMany({
        where: {
          tenantId: user.tenantId,
          stock: {
            lte: prisma.raw('minStock'),
          },
        },
      });

      if (products.length === 0) continue;

      const html = this.buildEmailHtml(products);

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: user.email,
        subject: 'StockAlert - Produits en rupture ou faible stock',
        html,
      });
    }
  }

  buildEmailHtml(products) {
    const rows = products.map((product) => `
      <tr>
        <td style="padding:8px;border:1px solid #e5e7eb;">${product.name}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;">${product.stock}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;">${product.minStock}</td>
      </tr>
    `).join('');

    return `
      <div style="font-family:Arial,sans-serif;">
        <h2>StockAlert</h2>
        <p>Voici les produits à vérifier aujourd'hui :</p>
        <table style="border-collapse:collapse;width:100%;">
          <thead>
            <tr>
              <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Produit</th>
              <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Stock</th>
              <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Stock minimum</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }
}

module.exports = new AlertService();
