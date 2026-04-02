import React, { useState, useEffect, useCallback } from 'react';
import { X, MessageCircle, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react';
import { supabase } from '../../utils/supabase';

const WhatsAppSetupModal = ({ show, onClose, userId }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

  const loadExistingConfig = useCallback(async () => {
    const { data } = await supabase
      .from('user_profiles')
      .select('whatsapp_number, callmebot_apikey, whatsapp_alerts_enabled')
      .eq('id', userId)
      .single();

    if (data?.whatsapp_number) {
      setPhone(data.whatsapp_number);
      setApiKey(data.callmebot_apikey || '');
      setStep(4);
    }
  }, [userId]);

  useEffect(() => {
    if (show && userId) loadExistingConfig();
  }, [show, userId, loadExistingConfig]);

  const handleSaveAndTest = async () => {
    if (!phone.trim() || !apiKey.trim()) return;
    setLoading(true);
    setTestStatus('sending');

    try {
      const cleanPhone = phone.replace(/\s/g, '').replace('+', '');

      const { error } = await supabase
        .from('user_profiles')
        .update({
          whatsapp_number: cleanPhone,
          callmebot_apikey: apiKey.trim(),
          whatsapp_alerts_enabled: true,
        })
        .eq('id', userId);

      if (error) throw error;

      const testMessage = encodeURIComponent(
        `*StockAlert activé!*\n\nVous recevrez vos alertes de stock bas tous les jours à 18h00.\n\nBonne gestion de stock! `
      );
      const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${testMessage}&apikey=${apiKey.trim()}`;
      const response = await fetch(url);

      if (response.ok) {
        setTestStatus('sent');
        setStep(4);
      } else {
        setTestStatus('error');
      }
    } catch (err) {
      console.error('WhatsApp setup error:', err);
      setTestStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    await supabase
      .from('user_profiles')
      .update({ whatsapp_alerts_enabled: false, whatsapp_number: null, callmebot_apikey: null })
      .eq('id', userId);
    setStep(1);
    setPhone('');
    setApiKey('');
    setTestStatus(null);
  };

  if (!show) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '460px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MessageCircle size={22} color="white" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Alertes WhatsApp
              </h2>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                Notification automatique à 18h00 chaque jour
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: '32px', height: '32px', borderRadius: '8px', border: 'none',
            background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <X size={18} />
          </button>
        </div>

        {/* STEP 4: Configured */}
        {step === 4 && (
          <div>
            <div style={{
              background: '#d1fae5', border: '1px solid #10b981',
              borderRadius: '12px', padding: '16px', marginBottom: '20px',
              display: 'flex', gap: '12px', alignItems: 'flex-start',
            }}>
              <CheckCircle size={22} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ margin: '0 0 4px 0', fontWeight: '700', color: '#065f46', fontSize: '15px' }}>
                  WhatsApp connecté !
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: '#047857' }}>
                  Alertes envoyées au +{phone} tous les soirs à 18h00
                </p>
              </div>
            </div>

            {testStatus === 'sent' && (
              <p style={{ fontSize: '13px', color: '#10b981', textAlign: 'center', marginBottom: '16px' }}>
                Message de test envoyé — vérifiez votre WhatsApp
              </p>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setStep(2); setTestStatus(null); }}
                style={{
                  flex: 1, padding: '12px', border: '1px solid var(--border)',
                  borderRadius: '8px', background: 'var(--surface)', color: 'var(--text-primary)',
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                }}
              >
                Modifier
              </button>
              <button
                onClick={handleDisable}
                style={{
                  flex: 1, padding: '12px', border: '1px solid var(--danger)',
                  borderRadius: '8px', background: 'var(--danger-light)', color: 'var(--danger)',
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                }}
              >
                Désactiver
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: Instructions */}
        {step === 1 && (
          <div>
            <div style={{
              background: 'var(--bg-secondary)', borderRadius: '12px',
              padding: '16px', marginBottom: '20px',
            }}>
              <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>
                Configuration (gratuit, 2 minutes)
              </p>
              {[
                { num: '1', text: 'Cliquez le bouton vert ci-dessous pour ouvrir WhatsApp' },
                { num: '2', text: 'Envoyez le message à CallMeBot (numéro espagnol, c\'est normal)' },
                { num: '3', text: 'CallMeBot vous répondra avec votre clé API — copiez-la' },
                { num: '4', text: 'Revenez ici et entrez votre numéro + clé API' },
              ].map(({ num, text }) => (
                <div key={num} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
                  <span style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: '#25D366', color: 'white', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: '700',
                  }}>
                    {num}
                  </span>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/34644652169?text=I%20allow%20callmebot%20to%20send%20me%20messages"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '14px', borderRadius: '10px',
                background: '#25D366', color: 'white',
                fontSize: '15px', fontWeight: '700', textDecoration: 'none',
                marginBottom: '12px',
              }}
            >
              <MessageCircle size={20} />
              Ouvrir WhatsApp → Activer CallMeBot
              <ExternalLink size={14} />
            </a>

            <button
              onClick={() => setStep(2)}
              style={{
                width: '100%', padding: '12px', border: '1px solid var(--border)',
                borderRadius: '10px', background: 'transparent', color: 'var(--text-secondary)',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              }}
            >
              J'ai ma clé API → Continuer
            </button>
          </div>
        )}

        {/* STEP 2: Enter credentials */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Votre numéro WhatsApp
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="2250701234567 (sans le +)"
                style={{
                  width: '100%', padding: '12px', border: '1px solid var(--border)',
                  borderRadius: '8px', background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)', fontSize: '15px', boxSizing: 'border-box',
                }}
              />
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '6px 0 0' }}>
                Côte d'Ivoire: 225 suivi de votre numéro sans le 0
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Clé API CallMeBot
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Ex: 1234567"
                style={{
                  width: '100%', padding: '12px', border: '1px solid var(--border)',
                  borderRadius: '8px', background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)', fontSize: '15px', boxSizing: 'border-box',
                }}
              />
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '6px 0 0' }}>
                Reçue par WhatsApp depuis CallMeBot après activation
              </p>
            </div>

            {testStatus === 'error' && (
              <div style={{
                background: 'var(--danger-light)', border: '1px solid var(--danger)',
                borderRadius: '8px', padding: '12px', marginBottom: '16px',
                display: 'flex', gap: '8px', alignItems: 'flex-start',
              }}>
                <AlertCircle size={18} color="var(--danger)" style={{ flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--danger)' }}>
                  Envoi échoué. Vérifiez votre numéro (sans +) et votre clé API. Avez-vous bien envoyé le message d'activation à CallMeBot?
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1, padding: '12px', border: '1px solid var(--border)',
                  borderRadius: '8px', background: 'transparent', color: 'var(--text-secondary)',
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                }}
              >
                Retour
              </button>
              <button
                onClick={handleSaveAndTest}
                disabled={loading || !phone.trim() || !apiKey.trim()}
                style={{
                  flex: 2, padding: '12px', border: 'none', borderRadius: '8px',
                  background: loading || !phone.trim() || !apiKey.trim() ? 'var(--text-tertiary)' : '#25D366',
                  color: 'white', fontSize: '14px', fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                {loading ? 'Envoi...' : '✓ Sauvegarder et tester'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppSetupModal;