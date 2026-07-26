import React, { useState } from 'react';
import { Lock, Zap, X, ExternalLink } from 'lucide-react';

// ─────────────────────────────────────────
// Small "Coming Soon" badge for features in development
// ─────────────────────────────────────────
export const ComingSoonBadge = ({ lang = 'fr' }) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: '10px',
    background: 'var(--warning-light)',
    color: 'var(--warning)',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    marginLeft: '6px',
  }}>
    {lang === 'fr' ? 'Bientôt' : 'Soon'}
  </span>
);

// ─────────────────────────────────────────
// "Pro" badge — for Pro-locked features
// ─────────────────────────────────────────
export const ProBadge = () => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    padding: '2px 8px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    marginLeft: '6px',
  }}>
    <Zap size={10} />
    PRO
  </span>
);

// ─────────────────────────────────────────
// Locked feature overlay — wrap any component
// Shows lock icon + upgrade message
// ─────────────────────────────────────────
export const LockedFeature = ({ 
  message, 
  plan = 'pro',
  lang = 'fr',
  comingSoon = false,
  children 
}) => {
  const [showPrompt, setShowPrompt] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {/* Blurred/dimmed content underneath */}
      <div style={{
        filter: 'blur(2px)',
        opacity: 0.4,
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        {children}
      </div>

      {/* Lock overlay */}
      <div
        onClick={() => setShowPrompt(true)}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: comingSoon ? 'default' : 'pointer',
          gap: '8px',
          borderRadius: '8px',
          background: 'rgba(var(--bg-secondary-rgb, 248, 250, 252), 0.7)',
          backdropFilter: 'blur(1px)',
        }}
      >
        {comingSoon ? (
          <>
            <span style={{ fontSize: '24px' }}>🔜</span>
            <span style={{
              fontSize: '13px', fontWeight: '700',
              color: 'var(--warning)',
              background: 'var(--warning-light)',
              padding: '4px 12px', borderRadius: '20px',
            }}>
              {lang === 'fr' ? 'Bientôt disponible' : 'Coming soon'}
            </span>
          </>
        ) : (
          <>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
            }}>
              <Lock size={20} color="white" />
            </div>
            <span style={{
              fontSize: '13px', fontWeight: '600',
              color: 'var(--text-primary)', textAlign: 'center',
              padding: '0 16px',
            }}>
              {message}
            </span>
            <span style={{
              fontSize: '12px', fontWeight: '700', color: 'var(--primary)',
              textDecoration: 'underline',
            }}>
              {lang === 'fr' ? 'Passer à Pro →' : 'Upgrade to Pro →'}
            </span>
          </>
        )}
      </div>

      {/* Upgrade modal */}
      {showPrompt && !comingSoon && (
        <UpgradePrompt
          message={message}
          plan={plan}
          lang={lang}
          onClose={() => setShowPrompt(false)}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────
// Upgrade prompt modal
// ─────────────────────────────────────────
export const UpgradePrompt = ({ message, plan = 'pro', lang = 'fr', onClose }) => (
  <div
    onClick={onClose}
    style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '20px',
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: 'var(--surface)',
        borderRadius: '20px',
        padding: '28px 24px',
        maxWidth: '360px',
        width: '100%',
        textAlign: 'center',
      }}
    >
      <button onClick={onClose} style={{
        position: 'absolute', top: '16px', right: '16px',
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--text-tertiary)', display: 'flex',
      }}>
        <X size={20} />
      </button>

      {/* Icon */}
      <div style={{
        width: '64px', height: '64px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px',
        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
      }}>
        <Zap size={28} color="white" />
      </div>

      <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
        {lang === 'fr' ? 'Fonctionnalité Pro' : 'Pro Feature'}
      </h3>

      <p style={{ margin: '0 0 20px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
        {message}
      </p>

      {/* Pricing */}
      <div style={{
        background: 'var(--bg-secondary)', borderRadius: '12px',
        padding: '16px', marginBottom: '20px',
      }}>
        <p style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: '800', color: 'var(--primary)' }}>
          2 000 CFA
        </p>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
          {lang === 'fr' ? 'par mois • Annulez à tout moment' : 'per month • Cancel anytime'}
        </p>
      </div>

      {/* CTA */}
      <a
        href={`https://wa.me/YOUR_WHATSAPP?text=${encodeURIComponent(lang === 'fr' ? 'Bonjour, je veux passer à StockAlert Pro' : 'Hello, I want to upgrade to StockAlert Pro')}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '14px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white', textDecoration: 'none',
          fontSize: '15px', fontWeight: '700',
          marginBottom: '12px',
        }}
      >
        <ExternalLink size={18} />
        {lang === 'fr' ? 'Nous contacter sur WhatsApp' : 'Contact us on WhatsApp'}
      </a>

      <button onClick={onClose} style={{
        width: '100%', padding: '12px', border: '1px solid var(--border)',
        borderRadius: '12px', background: 'transparent', color: 'var(--text-secondary)',
        fontSize: '14px', cursor: 'pointer', fontWeight: '500',
      }}>
        {lang === 'fr' ? 'Pas maintenant' : 'Not now'}
      </button>
    </div>
  </div>
);

// ─────────────────────────────────────────
// Product limit warning banner
// Show this when user is near/at their limit
// ─────────────────────────────────────────
export const ProductLimitBanner = ({ current, max, lang = 'fr' }) => {
  const percentage = (current / max) * 100;
  const isNear = percentage >= 80;
  const isAt = current >= max;

  if (!isNear) return null;

  return (
    <div style={{
      padding: '12px 16px',
      borderRadius: '10px',
      background: isAt ? 'var(--danger-light)' : 'var(--warning-light)',
      border: `1px solid ${isAt ? 'var(--danger)' : 'var(--warning)'}`,
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
    }}>
      <p style={{
        margin: 0, fontSize: '13px',
        color: isAt ? 'var(--danger)' : 'var(--warning)',
        fontWeight: '600',
      }}>
        {isAt
          ? (lang === 'fr' ? `Limite atteinte (${current}/${max} produits). Passez à Pro.` : `Limit reached (${current}/${max} products). Upgrade to Pro.`)
          : (lang === 'fr' ? `${current}/${max} produits utilisés` : `${current}/${max} products used`)
        }
      </p>
      {isAt && (
        <span style={{
          fontSize: '12px', fontWeight: '700', color: 'var(--danger)',
          whiteSpace: 'nowrap', textDecoration: 'underline', cursor: 'pointer',
        }}>
          {lang === 'fr' ? 'Upgrade →' : 'Upgrade →'}
        </span>
      )}
    </div>
  );
};

// ─────────────────────────────────────────
// Upgrade Modal — Main modal for feature restrictions
// Shows based on which feature user tried to access
// ─────────────────────────────────────────
export const UpgradeModal = ({ show, onClose, feature, lang = 'fr' }) => {
  if (!show) return null;

  const featureMessages = {
    fr: {
      maxProducts: {
        title: 'Limite de produits atteinte',
        message: 'Vous avez atteint la limite de 30 produits. Passez à Pro pour gérer jusqu\'à 500 produits ou Business pour illimité.',
      },
      canAddWorkers: {
        title: 'Fonction réservée au Pro',
        message: 'L\'ajout de travailleurs est une fonction Pro. Contactez-nous pour passer à Pro dès aujourd\'hui.',
      },
      canBulkImport: {
        title: 'Import en masse — Pro uniquement',
        message: 'L\'import de plusieurs produits à la fois est réservé aux utilisateurs Pro.',
      },
      canExportExcel: {
        title: 'Export Excel — Pro uniquement',
        message: 'L\'export en Excel et les rapports personnalisés sont disponibles en Pro.',
      },
      canSeeAnalytics: {
        title: 'Analytics — Pro uniquement',
        message: 'Les analytics et graphiques détaillés sont disponibles en Pro.',
      },
    },
    en: {
      maxProducts: {
        title: 'Product limit reached',
        message: 'You\'ve reached the 30 product limit. Upgrade to Pro for up to 500 products or Business for unlimited.',
      },
      canAddWorkers: {
        title: 'Pro Feature',
        message: 'Adding workers is a Pro feature. Contact us to upgrade today.',
      },
      canBulkImport: {
        title: 'Bulk Import — Pro Only',
        message: 'Importing multiple products at once is a Pro feature.',
      },
      canExportExcel: {
        title: 'Excel Export — Pro Only',
        message: 'Excel export and custom reports are available on Pro.',
      },
      canSeeAnalytics: {
        title: 'Analytics — Pro Only',
        message: 'Detailed analytics and charts are available on Pro.',
      },
    }
  };

  const content = featureMessages[lang]?.[feature] || featureMessages['fr'].maxProducts;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          borderRadius: '20px',
          padding: '32px 24px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-tertiary)', display: 'flex',
          }}
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)',
        }}>
          <Zap size={28} color="white" />
        </div>

        <h3 style={{
          margin: '0 0 12px', fontSize: '20px',
          fontWeight: '700', color: 'var(--text-primary)',
        }}>
          {content.title}
        </h3>

        <p style={{
          margin: '0 0 24px', fontSize: '14px',
          color: 'var(--text-secondary)', lineHeight: '1.6',
        }}>
          {content.message}
        </p>

        {/* Pricing */}
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: '12px',
          padding: '16px', marginBottom: '24px',
        }}>
          <p style={{
            margin: '0 0 4px', fontSize: '28px',
            fontWeight: '800', color: 'var(--primary)',
          }}>
            2 000 CFA
          </p>
          <p style={{
            margin: 0, fontSize: '13px',
            color: 'var(--text-secondary)',
          }}>
            {lang === 'fr' ? 'par mois • Annulez à tout moment' : 'per month • Cancel anytime'}
          </p>
        </div>

        {/* CTA */}
        <a
          href={`https://wa.me/YOUR_WHATSAPP?text=${encodeURIComponent(lang === 'fr' ? 'Bonjour, je veux passer à StockAlert Pro' : 'Hello, I want to upgrade to StockAlert Pro')}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '14px', borderRadius: '12px',
            background: 'var(--primary)',
            color: 'white', textDecoration: 'none',
            fontSize: '15px', fontWeight: '700',
            marginBottom: '12px',
            border: 'none', cursor: 'pointer',
          }}
        >
          <ExternalLink size={18} />
          {lang === 'fr' ? 'Nous contacter sur WhatsApp' : 'Contact us on WhatsApp'}
        </a>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '12px', border: '1px solid var(--border)',
            borderRadius: '12px', background: 'transparent',
            color: 'var(--text-secondary)', fontSize: '14px',
            cursor: 'pointer', fontWeight: '500',
          }}
        >
          {lang === 'fr' ? 'Pas maintenant' : 'Not now'}
        </button>
      </div>
    </div>
  );
};