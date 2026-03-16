import React, { useState } from 'react';
import { Package, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './LoginScreen.css';

const SignupScreen = ({ onBackToLogin }) => {
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const { error } = await signUp(
      formData.email,
      formData.password,
      formData.ownerName,
      'owner', 
      { business_name: formData.businessName }
    );

    if (error) throw error;

    alert('✓ Compte créé avec succès! Connectez-vous maintenant.');
    onBackToLogin();
  } catch (err) {
    console.error('Signup error:', err);
    if (err.message && err.message.includes('already registered')) {
      setError('Cet email est déjà utilisé. Essayez de vous connecter.');
    } else {
      setError(err.message || 'Erreur lors de la création du compte');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-screen">
      <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Package size={48} className="login-icon" />
          <h1>StockAlert</h1>
          <p>Créez votre compte gratuit</p>
        </div>

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

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>
              <User size={18} />
              Nom de votre entreprise
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="Ex: Pièces Auto Abidjan"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>
              <User size={18} />
              Votre nom complet
            </label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              placeholder="Ex: Jean Kouassi"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>
              <Mail size={18} />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="votre@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>
              <Lock size={18} />
              Mot de passe
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Minimum 6 caractères"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <button 
          onClick={onBackToLogin}
          className="signup-link"
          style={{
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            background: 'transparent',
            border: 'none',
            color: 'var(--primary)',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          <ArrowLeft size={16} />
          Retour à la connexion
        </button>
      </div>
    </div>
  </div>
  );
};

export default SignupScreen;