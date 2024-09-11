import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Login({ setIsAuthenticated }) {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo(prevState => ({ ...prevState, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError('Email and password are required');
    }
    try {
      const url = `http://localhost:8080/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginInfo)
      });
      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', jwtToken); // Store JWT token in localStorage
        localStorage.setItem('loggedInUser', name); // Store user name in localStorage
        setIsAuthenticated(true); // Set authentication status
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } else if (error) {
        handleError(error.details[0]?.message || message); // Handle error message
      } else {
        handleError(message || 'Login failed');
      }
    } catch (err) {
      handleError(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className='container'>
      <h1>Welcome Back!</h1>
      <p>Let's continue our speech therapy journey.</p>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor='email'>Email</label>
          <input
            onChange={handleChange}
            type='email'
            name='email'
            placeholder='Enter your email...'
            value={loginInfo.email}
            required
          />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            onChange={handleChange}
            type='password'
            name='password'
            placeholder='Enter your password...'
            value={loginInfo.password}
            required
          />
        </div>
        <button type='submit'>Login</button>
        <span>Don't have an account? <Link to="/signup">Signup</Link></span>
      </form>
    </div>
  );
}

export default Login;