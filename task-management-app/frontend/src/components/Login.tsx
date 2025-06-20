import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import axios, { AxiosError } from 'axios';
import './Login.css';

interface ErrorResponse {
  message: string;
}

const Login: React.FC = () => {
  console.log("Rendering Login component");

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Attempting to login with:", { username, password });
      const response = await loginUser(username, password);
      console.log("Login response:", response);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', username);
      alert('Login successful');
      navigate('/dashboard'); // Redirect to tasks page or dashboard
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      console.error('Login failed:', error);
      alert("login failed. No user found with these credentials");
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back to your Task Manager</h2>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                className="auth-input"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            <span className="btn-text">Sign In</span>
            <span className="btn-icon">→</span>
          </button>
        </form>
        
        <div className="auth-footer">
          <p className="auth-link-text">Don't have an account?</p>
          <button type="button" className="auth-btn secondary" onClick={handleRegisterRedirect}>
            <span className="btn-text">Create Account</span>
            <span className="btn-icon">+</span>
          </button>
        </div>
      </div>
      
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>
    </div>
  );
};

export default Login;