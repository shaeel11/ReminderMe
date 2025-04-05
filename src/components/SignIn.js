import React, { useState, useContext } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const API_URL = process.env.REACT_APP_API_URL;

function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login`, formData);
      console.log('Login successful', res.data);
      login(res.data.token);
      navigate('/calendar');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default SignIn;