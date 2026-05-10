import { useState, useEffect } from 'react';
import API from '../utils/api';
import { useRouter } from 'next/router';
import { FiMail, FiLock, FiLogIn, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const wakeupBackend = async () => {
      try {
        setIsWakingUp(true);
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
      alert(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'white', overflow: 'hidden' }}>
      {/* Left Side: Branding & Visual (Desktop Only) */}
      <div style={{ 
        flex: '1.2', 
        position: 'relative', 
        background: '#0f172a', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '80px',
        color: 'white',
        overflow: 'hidden'
      }} className="auth-sidebar">
        {/* Abstract Background Elements */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'var(--primary)', borderRadius: '50%', filter: 'blur(120px)', opacity: '0.4' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '300px', height: '300px', background: 'var(--secondary)', borderRadius: '50%', filter: 'blur(100px)', opacity: '0.3' }}></div>

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px' }}>
              <FiCheckCircle size={32} />
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-1px' }}>TaskMaster</h2>
          </div>

          <h1 style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-2px' }}>
            Manage your tasks <br />
            <span style={{ color: 'var(--primary)' }}>like a pro.</span>
          </h1>
          <p style={{ fontSize: '20px', color: '#94a3b8', maxWidth: '480px', lineHeight: '1.6', marginBottom: '48px' }}>
            The all-in-one workspace to organize, track, and complete your daily goals with speed and elegance.
          </p>

          <div style={{ display: 'grid', gap: '20px' }}>
            {[
              'Real-time synchronization',
              'Intelligent task prioritization',
              'Premium glassmorphism interface'
            ].map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', fontWeight: '500', color: '#cbd5e1' }}>
                <FiCheckCircle style={{ color: 'var(--primary)' }} /> {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Image/Visual */}
        <img 
          src="/auth-visual.png" 
          alt="Visual" 
          style={{ 
            position: 'absolute', 
            bottom: '-100px', 
            right: '-100px', 
            width: '600px', 
            opacity: '0.6',
            transform: 'rotate(-10deg)',
            pointerEvents: 'none'
          }} 
        />
      </div>

      {/* Right Side: Auth Form */}
      <div style={{ 
        flex: '1', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '40px',
        background: 'var(--bg-app)'
      }}>
        <div style={{ maxWidth: '400px', width: '100%', animation: 'fadeIn 0.8s ease-out' }}>
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>Login</h3>
            <p style={{ color: 'var(--text-muted)' }}>Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  placeholder="hello@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '12px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '15px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600' }}>Password</label>
                <a href="#" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Forgot?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '12px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '15px' }}
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
                boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)'
              }}
            >
              {isLoading ? 'Authenticating...' : <>Sign In <FiArrowRight /></>}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Don't have an account? <a href="/register" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Create one</a>
            </p>
          </div>

          {isWakingUp && (
            <div style={{ marginTop: '24px', textAlign: 'center', color: 'var(--primary)', fontSize: '12px', fontWeight: '600', animation: 'pulse 2s infinite' }}>
              ⚙️ Server is warming up... Please wait a few seconds.
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .auth-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
