import React, { useState } from 'react';
import { Package, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import SignupScreen from './SignUpScreen';
import './LoginScreen.css';

const LoginScreen = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSignup, setShowSignup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message === 'Invalid login credentials' 
        ? 'Email ou mot de passe incorrect' 
        : error.message);
      setLoading(false);
    }
  };

  if (showSignup) {
  return <SignupScreen onBackToLogin={() => setShowSignup(false)} />;
}

  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <Package size={48} className="login-icon" />
            <h1>StockAlert</h1>
            <p>Gestion d'inventaire</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
              style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
              }}
            >
              {loading ? (
                'Connexion...'
              ) : (
                <>
                  <LogIn size={20} />
                  Se connecter
                </>
              )}
            </button>

            <button 
              type="button"
              onClick={() => setShowSignup(true)}
              className="signup-link"
            >
              Créer un nouveau compte
            </button>

          </form>

          <div className="login-footer">
            <p>Connectez-vous pour accéder à l'inventaire</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;