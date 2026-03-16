import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AddWorkerModal = ({ show, onClose, onWorkerAdded }) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    // Store current session
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (!currentSession) {
      throw new Error('You must be logged in to add workers');
    }

    const ownerId = currentSession.user.id;

    // Create worker account (will auto-login the new user - we'll revert this)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create worker account');

    const workerId = authData.user.id;

    // Force confirm email
    await supabase.rpc('confirm_user_email', { user_id: workerId });

    // Create worker profile with owner's tenant_id
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([{
        id: workerId,
        email: formData.email,
        full_name: formData.fullName,
        role: 'worker',
        tenant_id: ownerId, // Worker belongs to owner's tenant
        created_by: ownerId
      }]);

    if (profileError) throw profileError;

    // CRITICAL: Restore the owner's session
    await supabase.auth.setSession({
      access_token: currentSession.access_token,
      refresh_token: currentSession.refresh_token
    });

    console.log('Worker created successfully:', {
      workerId,
      role: 'worker',
      tenant_id: ownerId
    });

    setFormData({ fullName: '', email: '', password: '' });
    onWorkerAdded();
    onClose();

  } catch (err) {
    console.error('Worker creation error:', err);
    setError(err.message || 'Erreur lors de la création du travailleur');
  } finally {
    setLoading(false);
  }
};

return (
  <div 
    className="modal-overlay" 
    onClick={onClose}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}
  >
    <div 
      className="modal-content" 
      onClick={(e) => e.stopPropagation()}
      style={{
        background: 'var(--surface)',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <UserPlus size={24} />
          Ajouter un travailleur
        </h2>
        <button 
          onClick={onClose}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{
            background: 'var(--danger-light)',
            border: '1px solid var(--danger)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            fontSize: '14px',
            color: 'var(--danger)'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '8px'
          }}>
            Nom complet
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Ex: Jean Kouassi"
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '15px'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '8px'
          }}>
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jean@example.com"
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '15px'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '8px'
          }}>
            Mot de passe
          </label>
          <input
            type="text"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Minimum 6 caractères"
            required
            minLength={6}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '15px'
            }}
          />
          <small style={{ 
            display: 'block',
            marginTop: '6px',
            color: 'var(--text-tertiary)', 
            fontSize: '12px' 
          }}>
            Le travailleur utilisera cet email et ce mot de passe pour se connecter
          </small>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '12px' 
        }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              background: 'var(--primary)',
              color: 'white',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Ajout...' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  </div>
);
}

export default AddWorkerModal;