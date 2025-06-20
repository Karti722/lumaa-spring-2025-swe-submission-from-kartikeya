import React, { useState } from 'react';
import { registerUser, loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      
      await registerUser(email, password);
      alert('Registration successful');
            console.log("Attempting to login with:", { email, password });
            const response = await loginUser(email, password);
            console.log("Login response:", response);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', email);
            alert('Login successful');
            navigate('/dashboard'); // Redirect to tasks page or dashboard
    } catch (error) {
      alert('Registration failed');
    }
  };

    const handleLoginRedirect = () => {
    navigate('/login');
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Join Us Today</h2>
          <p className="auth-subtitle">Create your account to get started</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                className="auth-input"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="input-group">
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                className="auth-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="auth-btn primary">
            <span className="btn-text">Create Account</span>
            <span className="btn-icon">✨</span>
          </button>
        </form>
        
        <div className="auth-footer">
          <p className="auth-link-text">Already have an account?</p>
          <button type="button" className="auth-btn secondary" onClick={handleLoginRedirect}>
            <span className="btn-text">Sign In</span>
            <span className="btn-icon">→</span>
          </button>
        </div>
      </div>
      
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
      </div>
    </div>
  );
};

export default Register;