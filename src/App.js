import React, { useState, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import GameCanvas from './components/GameCanvas';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playerPosition, setPlayerPosition] = useState({ curr_x: 0, curr_y: 0 });

  const validateTokenAndSetAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Uncomment and use your actual validation endpoint
        // const response = await fetch('http://localhost:8080/auth/validate', {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json',
        //   },
        // });
        // const result = await response.json();
        // if (result.success) {
        setIsAuthenticated(true);
        await fetchPlayerPosition(token);
        // } else {
        //   handleLogout();
        // }
      } catch (error) {
        console.error('Error validating token:', error);
        handleLogout();
      }
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    validateTokenAndSetAuth();
  }, []);

  const fetchPlayerPosition = async (token) => {
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/' element={isAuthenticated ? <Navigate to="/child" /> : <Navigate to="/login" />} />
          <Route path='/login' element={isAuthenticated ? <Navigate to="/child" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path='/signup' element={<Signup />} />
          <Route 
            path='/home' 
            element={isAuthenticated ? <Home playerPosition={playerPosition} /> : <Navigate to="/login" />} 
          />
          <Route 
            path='/child' 
            element={isAuthenticated ? <GameCanvas playerPosition={playerPosition} /> : <Navigate to="/login" />} 
          />
        </Routes>
        {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;