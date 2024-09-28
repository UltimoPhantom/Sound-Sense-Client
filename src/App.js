import React, { useState, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import GameCanvas from './components/GameCanvas';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import LandingPage from './pages/landing'
import { ToastContainer } from 'react-toastify';
import Modal from './pages/model';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playerPosition, setPlayerPosition] = useState({ curr_x: 0, curr_y: 0 });
  const [treasureArray, setTreasureArray] = useState([])
  const [showModal, setShowModal]=useState(false);

  const validateTokenAndSetAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        setIsAuthenticated(true);
        await fetchPlayerTreasureArray(token);
        await fetchPlayerPosition(token);
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

  const fetchPlayerTreasureArray = async (token) => {
    try {
      const response = await fetch("http://localhost:8080/player/getTreasureArray", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      const { arr, success } = await response.json();
      setTreasureArray(arr)
    } catch (err) {
      console.log(err.message);
    }
  };

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

      <div className='h-screen flex flex-col items-center gap-6 bg-black text-white'> 
            <h1 className='text-5xl font-bold mt-4'>Pop Model</h1>
            <button onClick={()=>setShowModal(true)} className='bg-violet-500 px-4 py-2 rounded-lg'>Open</button>
            {showModal && <Modal onClose={()=>setShowModal(false)} />}
       </div>


        <Routes>

           {/* <Route path='/' element={<Modal />} /> */}
          


          <Route path='/login' element={isAuthenticated ? <Navigate to="/home" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />

          <Route path='/signup' element={<Signup />} />

          <Route
            path='/home'
            element={isAuthenticated ? <Home playerPosition={playerPosition} treasureArray={treasureArray} /> : <Navigate to="/login" />}
          />

          <Route
            path='/child'
            element={isAuthenticated ? <GameCanvas playerPosition={playerPosition} treasureArray={treasureArray} /> : <Navigate to="/login" />}
          />
        </Routes>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;
