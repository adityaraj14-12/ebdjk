import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Fixed import
import { FaUserCircle, FaInfoCircle, FaPhoneAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import './style.css'; // Ensure this file doesn't override Bootstrap styles unnecessarily
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const checkLoginStatus = () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsLoggedIn(true);
        setUsername(decodedToken.username || '');
      } catch (error) {
        console.error('Invalid token:', error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();

    const storageListener = () => checkLoginStatus();
    window.addEventListener('storage', storageListener);

    return () => {
      window.removeEventListener('storage', storageListener);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
           <div className="container">
             <Link className="navbar-brand d-flex align-items-center" to="/">
               {/* Logo */}
               <img
                 src="https://th.bing.com/th/id/OIP.6DF--3U8z5sl-b7ihvYYkwHaEK?rs=1&pid=ImgDetMain"
                 alt="Gadhi Chaiya"
                 className="logo-img me-2"
               />

            <span className="logo-text">CarRental</span>
          
        </Link>

        

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                <FaInfoCircle size={20} className="nav-icon me-2" />
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                <FaPhoneAlt size={20} className="nav-icon me-2" />
                Contact Us
              </Link>
            </li>
            {isLoggedIn ? (
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  to="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaUserCircle size={24} className="me-2" />
                  {username}
                </Link>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <FaSignInAlt size={20} className="nav-icon me-2" />
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <FaUserPlus size={20} className="nav-icon me-2" />
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
