import React from 'react';
import { Package, Plus, ArrowRight, CheckCircle, Bell, BarChart2 } from 'lucide-react';

const OnboardingEmptyState = ({ onAddProduct, userName }) => {
  const firstName = userName?.split(' ')[0] || '';

  const features = [
    {
      icon: Package,
      color: 'var(--primary)',
      bg: 'var(--primary-light)',
      title: 'Suivez votre stock',
      desc: 'Ajoutez vos produits et leur quantité',
    },
    {
      icon: Bell,
      color: '#25D366',
      bg: '#d1fae5',
      title: 'Alertes WhatsApp',
      desc: 'Recevez un message à 18h si le stock est bas',
    },
    {
      icon: BarChart2,
      color: 'var(--warning)',
      bg: 'var(--warning-light)',
      title: 'Historique & ventes',
      desc: 'Suivez chaque mouvement de stock',
    },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '32px 20px 100px',
      minHeight: '60vh',
      justifyContent: 'center',
    }}>

      {/* Logo/Icon */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '24px',
        background: 'var(--primary-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        boxShadow: '0 8px 24px rgba(37, 99, 235, 0.15)',
      }}>
        <Package size={40} color="var(--primary)" strokeWidth={1.5} />
      </div>

      {/* Welcome message */}
      <h2 style={{
        fontSize: '22px',
        fontWeight: '800',
        color: 'var(--text-primary)',
        margin: '0 0 8px',
        textAlign: 'center',
      }}>
        {firstName ? `Bienvenue, ${firstName} !` : 'Bienvenue sur StockAlert !'}
      </h2>

      <p style={{
        fontSize: '15px',
        color: 'var(--text-secondary)',
        margin: '0 0 28px',
        textAlign: 'center',
        lineHeight: '1.6',
        maxWidth: '300px',
      }}>
        Ajoutez votre premier produit pour commencer à gérer votre stock
      </p>

      {/* Feature highlights */}
      <div style={{
        width: '100%',
        maxWidth: '360px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '28px',
      }}>
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: f.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={20} color={f.color} />
              </div>
              <div>
                <p style={{ margin: '0 0 2px', fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>
                  {f.title}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {f.desc}
                </p>
              </div>
              <CheckCircle size={18} color="var(--border)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
            </div>
          );
        })}
      </div>

      {/* CTA Button */}
      <button
        onClick={onAddProduct}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '16px 28px',
          border: 'none',
          borderRadius: '14px',
          background: 'var(--primary)',
          color: 'white',
          fontSize: '16px',
          fontWeight: '700',
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
          transition: 'all 0.2s',
          width: '100%',
          maxWidth: '360px',
          justifyContent: 'center',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <Plus size={22} />
        Ajouter mon premier produit
        <ArrowRight size={18} />
      </button>

      <p style={{
        marginTop: '16px',
        fontSize: '12px',
        color: 'var(--text-tertiary)',
        textAlign: 'center',
      }}>
        Gratuit • Fonctionne hors ligne • Alertes WhatsApp
      </p>
    </div>
  );
};

export default OnboardingEmptyState;