import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct import
import './style.css'; // Make sure your styles are applied

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  // Check login status when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsLoggedIn(true);
        setUsername(decodedToken.username || '');  // Adjust this if your JWT has a different structure
      } catch (error) {
        console.error('Invalid token:', error);
        setIsLoggedIn(false); // Reset login state if token is invalid
      }
    }
  }, []);

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
    navigate('/login');  // Redirect user to login page after logout
  };

  return (
    <nav className="navbar sticky-top">
      <div className="navbar-container">
        {/* Left-aligned CarRental */}
        <Link className="navbar-brand" to="/">
          CarRental
        </Link>

        {/* Toggler for mobile view */}
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

        {/* Right-aligned navbar items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {/* Car Rental Link */}
            <li className="nav-item">
              <Link className="nav-link" to="/car-rental">Car Rental</Link>
            </li>

            {/* About Link */}
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>

            {/* Contact Us Link */}
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact Us</Link>
            </li>

            {/* Conditionally render based on login state */}
            {isLoggedIn ? (
              <>
                {/* Profile Button */}
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link> {/* Update the link */}
                </li>

                {/* Logout Button */}
                <li className="nav-item">
                  <button className="nav-link" onClick={handleLogout}>Logout</button>
                </li>

                {/* Welcome Text */}
                <li className="nav-item">
                  <span className="nav-link">Welcome {username}</span>
                </li>
              </>
            ) : (
              <>
                {/* Login Link */}
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>

                {/* Register Link */}
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
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
