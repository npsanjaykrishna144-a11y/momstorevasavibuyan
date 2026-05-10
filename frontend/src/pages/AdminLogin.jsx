import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await api.loginAdmin(username, password);
      localStorage.setItem('adminToken', data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex justify-center items-center" style={{ minHeight: '100vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-8" style={{ fontSize: '2rem', color: 'var(--primary)' }}>Admin Login</h2>
        
        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Username</label>
            <input 
              type="text" 
              className="input-field" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>
        
        <div className="text-center mt-6">
          <a href="/" style={{ color: '#6b7280', fontSize: '0.9rem', textDecoration: 'underline' }}>&larr; Back to Store</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
