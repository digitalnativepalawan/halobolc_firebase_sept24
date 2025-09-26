import React, { useState } from 'react';
import { signInWithEmailPassword } from '../firebase';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailPassword(email, password);
      // On successful sign-in, the onAuthStateChanged listener in App.tsx
      // will automatically handle redirecting the user to the main app.
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ padding: '2rem', width: '350px' }}>
        <h2>Login</h2>
        <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={{ padding: '0.5rem' }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{ padding: '0.5rem' }}
          />
          <Button type="submit">Sign In</Button>
          {error && <p style={{ color: 'red', marginTop: '1rem' }}>Invalid email or password</p>}
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
