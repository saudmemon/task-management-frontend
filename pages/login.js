import { useState, useEffect } from 'react';
import API from '../utils/api';
import { useRouter } from 'next/router';
import { FiMail, FiLock, FiLogIn, FiArrowRight } from 'react-icons/fi';

/**
 * Login Page Component
 * Upgraded with premium aesthetics and backend wake-up strategy
 */
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const router = useRouter();

  /**
   * Backend Wake-up Strategy
   * Render free tier cold starts can take 30s+. 
   * We ping the root endpoint as soon as the user lands here.
   */
  useEffect(() => {
    const wakeupBackend = async () => {
      try {
        setIsWakingUp(true);
        // Silent ping to wake up the server
        await API.get('/');
      } catch (err) {
        console.log('Wakeup ping sent');
      } finally {
        setIsWakingUp(false);
      }
    };
    wakeupBackend();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        router.push('/dashboard');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top right, #8b5cf6, transparent), radial-gradient(circle at bottom left, #ec4899, transparent), #f8fafc',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass" style={{ 
        maxWidth: '440px', 
        width: '100%', 
        padding: '48px', 
        borderRadius: '24px', 
        boxShadow: 'var(--shadow-premium)',
        animation: 'fadeIn 0.6s ease-out'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'var(--primary)', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 20px',
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)'
          }}>
            <FiLogIn style={{ fontSize: '28px', color: 'white' }} />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px', marginBottom: '8px' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Securely access your task workspace</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '14px 16px 14px 48px', 
                  background: 'white',
                  border: '1px solid var(--border-light)', 
                  borderRadius: '12px', 
                  fontSize: '15px',
                  outline: 'none',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '14px 16px 14px 48px', 
                  background: 'white',
                  border: '1px solid var(--border-light)', 
                  borderRadius: '12px', 
                  fontSize: '15px',
                  outline: 'none',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '16px', 
              background: 'var(--primary)', 
              color: 'white', 
              borderRadius: '12px', 
              fontSize: '16px', 
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
            }}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                Signing In...
              </span>
            ) : (
              <>Sign In <FiArrowRight /></>
            )}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            New to TaskMaster? <a href="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '700' }}>Create an account</a>
          </p>
        </div>
        
        {isWakingUp && (
          <div style={{ 
            marginTop: '12px', 
            fontSize: '12px', 
            color: 'var(--primary)', 
            textAlign: 'center',
            animation: 'pulse 2s infinite'
          }}>
            Preparing your environment...
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
  );
}
