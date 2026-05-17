import { useState } from 'react';
import API from '../utils/api';
import { useRouter } from 'next/router';
import { FiUser, FiMail, FiLock, FiUserPlus, FiArrowRight, FiCheckCircle, FiZap } from 'react-icons/fi';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post('/auth/register', { name, email, password });
      alert(res.data.message || 'Registration successful');
      router.push('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'white', overflow: 'hidden' }}>
      {/* Left Side: Branding (Desktop Only) */}
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
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'var(--secondary)', borderRadius: '50%', filter: 'blur(120px)', opacity: '0.4' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '300px', height: '300px', background: 'var(--accent)', borderRadius: '50%', filter: 'blur(100px)', opacity: '0.3' }}></div>

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{ background: 'var(--secondary)', padding: '10px', borderRadius: '12px' }}>
              <FiZap size={32} />
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-1px' }}>TaskMaster</h2>
          </div>

          <h1 style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-2px' }}>
            Join the elite <br />
            <span style={{ color: 'var(--secondary)' }}>workspace.</span>
          </h1>
          <p style={{ fontSize: '20px', color: '#94a3b8', maxWidth: '480px', lineHeight: '1.6', marginBottom: '48px' }}>
            Create an account in seconds and start experiencing the most intuitive task management system ever built.
          </p>

          <div style={{ display: 'grid', gap: '20px' }}>
            {[
              'Unlimited task creations',
              'Advanced progress analytics',
              'Custom workspace themes'
            ].map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', fontWeight: '500', color: '#cbd5e1' }}>
                <FiCheckCircle style={{ color: 'var(--secondary)' }} /> {feature}
              </div>
            ))}
          </div>
        </div>

        <img 
          src="/auth-visual.png" 
          alt="Visual" 
          style={{ 
            position: 'absolute', 
            bottom: '-100px', 
            right: '-100px', 
            width: '600px', 
            opacity: '0.5',
            transform: 'scaleX(-1) rotate(10deg)',
            pointerEvents: 'none',
            filter: 'hue-rotate(180deg)'
          }} 
        />
      </div>

      {/* Right Side: Register Form */}
      <div className="auth-container" style={{ 
        flex: '1', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '40px',
        background: 'var(--bg-app)'
      }}>
        <div style={{ maxWidth: '400px', width: '100%', animation: 'fadeIn 0.8s ease-out' }}>
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>Create Account</h3>
            <p style={{ color: 'var(--text-muted)' }}>Get started for free. No credit card required.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '12px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '15px' }}
                />
              </div>
            </div>

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
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Password</label>
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
              className="primary-btn"
              style={{ 
                width: '100%', 
                padding: '16px', 
                background: 'var(--secondary)', 
                color: 'white', 
                borderRadius: '12px', 
                fontSize: '16px', 
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 10px 20px rgba(236, 72, 153, 0.2)'
              }}
            >
              {isLoading ? 'Creating...' : <>Join Now <FiArrowRight className="btn-icon" /></>}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Already have an account? <a href="/login" style={{ color: 'var(--secondary)', fontWeight: '700', textDecoration: 'none' }}>Sign in</a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .primary-btn {
          transition: all 0.3s ease;
        }
        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 25px rgba(236, 72, 153, 0.3) !important;
          filter: brightness(1.1);
        }
        .primary-btn:active {
          transform: translateY(0);
        }
        .btn-icon {
          transition: transform 0.3s ease;
        }
        .primary-btn:hover .btn-icon {
          transform: translateX(4px);
        }
        @media (max-width: 1024px) {
          .auth-sidebar {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .auth-container {
            padding: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
