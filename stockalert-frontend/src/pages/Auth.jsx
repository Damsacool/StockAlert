import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';

const Auth = () => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div style={{ maxWidth: '28rem', margin: '2rem auto', padding: '1rem' }}>
      <h2>{mode === 'signup' ? 'Créer un compte' : 'Connexion'}</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <Button onClick={() => setMode('signin')}>Connexion</Button>
        <Button variant="secondary" onClick={() => setMode('signup')}>Créer un compte</Button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {mode === 'signup' ? (
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nom complet" required />
        ) : null}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" required />
        {error ? <p style={{ color: 'red' }}>{error}</p> : null}
        <Button type="submit">{mode === 'signup' ? 'Créer le compte' : 'Se connecter'}</Button>
      </form>
    </div>
  );
};

export default Auth;
