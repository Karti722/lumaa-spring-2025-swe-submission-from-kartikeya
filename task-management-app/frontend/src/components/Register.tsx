import React, { useState } from 'react';
import { registerUser, loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

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
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Register</button>
      <button type="button" onClick={handleLoginRedirect}>Back to Login</button>
    </form>
  );
};

export default Register;