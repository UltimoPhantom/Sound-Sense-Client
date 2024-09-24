import '../index.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

function Home() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged out');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="home-container">
      <div className="content">
        <h1>Home Page</h1>
      </div>
      <nav className="navbar">
        <span className="navbar-user">Welcome, {loggedInUser}</span>
        <button className="navbar-button" onClick={() => navigate('/child')}>Children</button>
        <button className="navbar-button" onClick={() => navigate('/parents')}>Parents</button>
        <button className="navbar-button" onClick={() => navigate('/dashboard')}>Dashboard</button>
        <button className="navbar-button" onClick={handleLogout}>Logout</button>
      </nav>
      {/* <ToastContainer /> */}

      <h1>Working</h1>
    </div>

  
  );
}

export default Home;