import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import RefrshHandler from './RefrshHandler';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import GameCanvas from './components/GameCanvas';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<PrivateRoute element={<Home />} />} />
        <Route path='/child' element={<GameCanvas />} />
      </Routes>
    </div>
  );
}

export default App;