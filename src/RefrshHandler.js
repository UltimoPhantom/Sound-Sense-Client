import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RefrshHandler from './RefrshHandler';
import Home from './pages/Home';  // Adjusted import for Home
import Login from './pages/Login'; // Adjusted import for Login
import Signup from './pages/Signup'; // Adjusted import for Signup

function App() {
  return (
    <Router>
      <RefrshHandler setIsAuthenticated={() => {}} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
    </Router>
  );
}

export default App;
