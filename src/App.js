import React, { useState, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import GameCanvas from './components/GameCanvas';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ curr_x: 0, curr_y: 0 });

  // Private Route component to protect authenticated pages
  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  // Fetch player position (curr_x, curr_y) when authenticated
  const fetchPlayerPosition = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8080/player/getXY', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      if (result.success) {
        setPlayerPosition({ curr_x: result.curr_x, curr_y: result.curr_y });
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error fetching player position:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlayerPosition(); // Fetch player position after authentication
    }
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer />
        <Routes>
          <Route path='/' element={<Navigate to="/login" />} />
          <Route path='/login' element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/home' element={<PrivateRoute element={<Home playerPosition={playerPosition} />} />} />
          <Route path='/game' element={<PrivateRoute element={<GameCanvas />} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
