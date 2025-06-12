'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<'signup' | 'signin' | 'mfa'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      console.log('[AuthPage] checking session');
      try {
        const res = await fetch('/api/me');
        const isJSON = res.headers.get('content-type')?.includes('application/json');
        const data = isJSON ? await res.json() : null;
        console.log('[AuthPage] /api/me result:', res.status, data);
        if (res.ok) router.push('/');
        else setIsReady(true);
      } catch (err) {
        setIsReady(true);
      }
    };
    checkSession();
  }, [router]);

  const handleSignUp = async () => {
    setError('');
    const res = await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Failed to sign up');
    setQrCodeUrl(data.qrCode);
    setUserId(data.userId);
    setStep('mfa');
  };

  const handleSignIn = async () => {
    setError('');
    const res = await fetch('/api/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Failed to sign in');
    if (data.mfa_required) {
      setUserId(data.userId);
      setStep('mfa');
    } else {
      alert('Signed in successfully!');
      router.push('/');
    }
  };

  const handleVerifyMFA = async () => {
    if (!userId) return;
    const res = await fetch('/api/verify-mfa', {
      method: 'POST',
      body: JSON.stringify({ userId, token: mfaToken }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Invalid MFA code');
    router.push('/');
  };

  if (!isReady) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <div className="spinner" />
        <p>Loading Fund Lens...</p>
      </div>
    );
  }

  const isEmailValid = /^[^\s@]+@globalalternativefunds\.com$/.test(email);
  const isPasswordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{12,}$/.test(password);

  return (
    <div style={{
      backgroundColor: '#fff',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: 400,
        width: '100%',
        padding: '2rem',
        border: '1px solid #ccc',
        borderRadius: 12,
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        color: '#102948'
      }}>
        <h2 style={{ color: '#102948', marginBottom: '1.5rem', textAlign: 'center' }}>
          {step === 'signup' ? 'Sign Up' : step === 'signin' ? 'Sign In' : 'Enter MFA Code'}
        </h2>

        {(step === 'signup' || step === 'signin') && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                display: 'block',
                width: '93.5%',
                marginBottom: 12,
                padding: '0.75rem',
                borderRadius: 6,
                color: '#102948',
                border: `1px solid ${email ? (isEmailValid ? '#102948' : '#ef4444') : '#ccc'}`
              }}
            />
            {email && !isEmailValid && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: -8, marginBottom: 12 }}>
                Email must be @globalalternativefunds.com
              </p>
            )}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                display: 'block',
                width: '93.5%',
                marginBottom: 12,
                padding: '0.75rem',
                borderRadius: 6,
                color: '#102948',
                border: `1px solid ${password ? (isPasswordValid ? '#102948' : '#ef4444') : '#ccc'}`
              }}
            />
            {password && !isPasswordValid && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: -8, marginBottom: 12 }}>
                Password must be at least 12 characters and include a lowercase letter, uppercase letter, number, and special character.
              </p>
            )}
            <button
              onClick={step === 'signup' ? handleSignUp : handleSignIn}
              disabled={!isEmailValid || !isPasswordValid}
              style={{
                backgroundColor: (!isEmailValid || !isPasswordValid) ? '#ecd1bc' : '#cb8548',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '0.75rem',
                width: '100%',
                marginBottom: 12,
                cursor: (!isEmailValid || !isPasswordValid) ? 'not-allowed' : 'pointer'
              }}
            >
              {step === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#102948' }}>
              {step === 'signup' ? (
                <>Already have an account?{' '}
                  <button onClick={() => setStep('signin')} style={{ border: 'none', background: 'none', color: '#102948', cursor: 'pointer' }}>
                    Sign In
                  </button>
                </>
              ) : (
                <>Need an account?{' '}
                  <button onClick={() => setStep('signup')} style={{ border: 'none', background: 'none', color: '#102948', cursor: 'pointer' }}>
                    Sign Up
                  </button>
                </>
              )}
            </p>
          </>
        )}

        {step === 'mfa' && (
          <>
            {qrCodeUrl && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: 12 }}>Scan this QR code in your Google Authenticator app:</p>
                <img src={qrCodeUrl} alt="MFA QR Code" style={{ width: '70%', marginBottom: 12 }} />
              </div>
            )}
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={mfaToken}
              onChange={(e) => setMfaToken(e.target.value)}
              maxLength={6}
              style={{
                display: 'block',
                width: '93.5%',
                marginBottom: 12,
                padding: '0.75rem',
                borderRadius: 6,
                border: '1px solid #cb8548',
                color: '#102948'
              }}
            />
            <button
              onClick={handleVerifyMFA}
              disabled={!mfaToken.trim()}
              style={{
                backgroundColor: mfaToken.trim() ? '#cb8548' : '#ecd1bc',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '0.75rem',
                width: '100%',
                cursor: mfaToken.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Verify & Sign In
            </button>
          </>
        )}

        {error && (
          <p style={{ color: '#ef4444', marginTop: 16 }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
