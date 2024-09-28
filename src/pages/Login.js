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
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);
        setIsAuthenticated(true);
        navigate('/home');  
      } else if (error) {
        handleError(error.details[0]?.message || message);
      } else {
        handleError(message || 'Login failed');
      }
    } catch (err) {
      handleError(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md max-w-md w-full'>
        <h1 className='text-2xl font-bold mb-4'>Welcome Back!</h1>
        <p className='text-gray-600 mb-6'>Let's continue our speech therapy journey.</p>
        <form onSubmit={handleLogin}>
          <div className='mb-4'>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
            <input
              onChange={handleChange}
              type='email'
              name='email'
              className='mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='Enter your email...'
              value={loginInfo.email}
              required
            />
          </div>
          <div className='mb-6'>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password</label>
            <input
              onChange={handleChange}
              type='password'
              name='password'
              className='mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='Enter your password...'
              value={loginInfo.password}
              required
            />
          </div>
          <button
            type='submit'
            className='w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700'
          >
            Login
          </button>
          <div className='mt-4 text-center'>
            <span>Don't have an account? <Link to="/signup" className='text-indigo-600 hover:underline'>Signup</Link></span>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
