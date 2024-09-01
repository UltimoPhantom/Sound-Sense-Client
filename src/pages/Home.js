import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
  // Assuming you'll create a separate CSS file for Home component styles

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [products, setProducts] = useState([]);
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

    const fetchProducts = async () => {
        try {
            const url = "https://deploy-mern-app-1-api.vercel.app/products";
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            };
            const response = await fetch(url, headers);
            const result = await response.json();
            setProducts(result);
        } catch (err) {
            handleError(err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="home-container">
        <div className="content">
                <h1>Home Page</h1>
                {/* Add your content here */}
            </div>
            <nav className="navbar">
                <span className="navbar-user">Welcome, {loggedInUser}</span>
               
                <button className="navbar-button" onClick={() => navigate('/child')}>Children</button>
                <button className="navbar-button" onClick={() => navigate('/parents')}>Parents</button>
                <button className="navbar-button" onClick={() => navigate('/dashboard')}>Dashboard</button>
                <button className="navbar-button" onClick={handleLogout}>Logout</button>
            </nav>
            
            <ToastContainer />
        </div>
    );
}

export default Home;
