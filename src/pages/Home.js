// import '../index.css';
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { handleError, handleSuccess } from '../utils';
// import { ToastContainer } from 'react-toastify';

// function Home() {
//   const [loggedInUser, setLoggedInUser] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     setLoggedInUser(localStorage.getItem('loggedInUser'));
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('loggedInUser');
//     handleSuccess('User Logged out');
//     setTimeout(() => {
//       navigate('/login');
//     }, 1000);
//   };

//   return (
//     <div className="home-container">
//       <div className="content">
//         <h1>Home Page</h1>
//       </div>
//       <nav className="navbar">
//         <span className="navbar-user">Welcome, {loggedInUser}</span>
//         <button className="navbar-button" onClick={() => navigate('/child')}>Children</button>
//         <button className="navbar-button" onClick={() => navigate('/parents')}>Parents</button>
//         {/* <button className="navbar-button" onClick={() => navigate('/dashboard')}>Dashboard</button> */}
//         <button className="navbar-button" onClick={handleLogout}>Logout</button>
//       </nav>
//       {/* <ToastContainer /> */}

//       {/* <h1>Working</h1> */}
//     </div>


//   );
// }

// export default Home;
import '../index.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import HomeNavbar from './HomeNavbar';
import img_boy from "../images/boycrop.jpg";

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
    <div className="home-container min-h-screen bg-dark-900 text-white">
      <HomeNavbar loggedInUser={loggedInUser} handleLogout={handleLogout} />

      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between px-8 py-16 space-y-8 lg:space-y-0 lg:space-x-8">

        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6 px-8 lg:px-16 py-12 lg:py-16">
        <h2 className="text-3xl font-bold text-pink-500 border-b-4 border-pink-500 pb-2">
            Welcome, {loggedInUser}!
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            SpeechTherapyAI is here to assist children in overcoming phonetic challenges through interactive games and fun activities.
            Join us to experience a tailored journey designed to improve speech skills in an enjoyable way!
          </p>
          <button
            onClick={() => navigate('/child')}
            className="mt-4 py-3 px-6 border-2 border-transparent rounded-lg text-white font-semibold transition-transform duration-300 ease-in-out bg-gradient-to-r from-pink-500 to-purple-700
            hover:border-pink-500 hover:shadow-sm hover:shadow-purple-700 transform hover:scale-105"
          >
            Let’s Dive
          </button>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center lg:justify-center">
          <img
            src={img_boy}
            alt="Child illustration"
            className="w-3/4 max-w-md rounded-lg shadow-lg shadow-purple-700 transition-shadow hover:shadow-pink-500/70"
          />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Home;
