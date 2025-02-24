import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import axios, { AxiosError } from 'axios';

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
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
      <button type="button" onClick={handleRegisterRedirect}>Register</button>
    </form>
  );
};

export default Login;