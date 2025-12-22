import { useState } from 'react';
import API from '../utils/api';
import { useRouter } from 'next/router';

/**
 * Register Page Component
 * Allows new users to create an account with name, email, and password
 * Redirects to login page after successful registration
 */
export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  /**
   * Handle registration form submission
   * Creates new user account and redirects to login
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', { name, email, password });
      alert(res.data.message || 'Registration successful');
      router.push('/login');
    } catch (err) {
      // Extract error message with fallback
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      alert(errorMessage);
      console.error('Registration failed:', errorMessage);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FE9496', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, margin: 0 }}>
      <div style={{ maxWidth: '400px', width: '100%', background: '#4BCBEB', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)', borderTop: '5px solid #4BCBEB' }}>
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '10px', fontSize: '28px', fontWeight: 'bold' }}>Create Account</h1>
        <p style={{ textAlign: 'center', color: '#000', marginBottom: '30px' }}>Join us and start organizing your tasks</p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '6px' }}>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', transition: 'border-color 0.3s ease' }}
              onFocus={(e) => e.target.style.borderColor = '#FF4D6B'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '6px' }}>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', transition: 'border-color 0.3s ease' }}
              onFocus={(e) => e.target.style.borderColor = '#FF4D6B'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '6px' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', transition: 'border-color 0.3s ease' }}
              onFocus={(e) => e.target.style.borderColor = '#FF4D6B'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <button 
            type="submit" 
            style={{ width: '100%', padding: '12px', background: '#F3797E', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Create Account
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid #e0e0e0', paddingTop: '20px' }}>
          <p style={{ color: '#000', margin: 0 }}>Already have an account? <a href="/login" style={{ color: '#F3797E', textDecoration: 'none', fontWeight: 'bold' }}>Sign in here</a></p>
        </div>
      </div>
    </div>
  );
}
