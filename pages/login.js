import { useState } from 'react';
import API from '../utils/api';
import { useRouter } from 'next/router';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

/**
 * Login Page Component
 * Handles user authentication with email and password
 * Stores token and user data in localStorage on successful login
 */
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  /**
   * Handle login form submission
   * Authenticates user and stores credentials in localStorage
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data && res.data.token) {
        // Store authentication token
        localStorage.setItem('token', res.data.token);
        // Store user information
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        // Redirect immediately for better UX
        router.push('/dashboard');
      }
    } catch (err) {
      // Extract error message with fallback
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      alert(errorMessage);
      console.error('Login failed:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FE9496', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, margin: 0 }}>
      <div style={{ maxWidth: '400px', width: '100%', background: '#4BCBEB', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)', borderTop: '5px solid #4BCBEB' }}>
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '10px', fontSize: '28px', fontWeight: 'bold' }}>Welcome Back</h1>
        <p style={{ textAlign: 'center', color: '#000', marginBottom: '30px' }}>Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '6px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 12px 12px 40px', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', transition: 'border-color 0.3s ease' }}
                onFocus={(e) => e.target.style.borderColor = '#FF4D6B'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 12px 12px 40px', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', transition: 'border-color 0.3s ease' }}
                onFocus={(e) => e.target.style.borderColor = '#FF4D6B'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ width: '100%', padding: '12px', background: isLoading ? '#ccc' : '#F3797E', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onMouseOver={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {isLoading ? 'Signing In...' : <><FiLogIn /> Sign In</>}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid #e0e0e0', paddingTop: '20px' }}>
          <p style={{ color: '#000', margin: 0 }}>Don't have an account? <a href="/register" style={{ color: '#F3797E', textDecoration: 'none', fontWeight: 'bold' }}>Create one here</a></p>
        </div>
      </div>
    </div>
  );
}
