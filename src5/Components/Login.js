import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Login.css'; // Assuming you have this CSS file
import { jwtDecode } from "jwt-decode"; // Correct import

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset errors before submitting
    setErrors({
      email: "",
      password: "",
    });

    // Make the API request to the backend for login
    axios
      .post("http://localhost:9090/api/auth/login/logi", formData)
      .then((response) => {
        // Clear any previous messages
        setMessage("");

        // Store JWT token in localStorage after successful login
        const token = response.data.token;
        sessionStorage.setItem('token', token);

        // Decode the token to get the username (or email) from the payload
        const decodedToken = jwtDecode(token);
        const username = decodedToken.sub; // Adjust
        // based on your token structure
        sessionStorage.setItem('username', username);  // Store username in localStorage
        const name = decodedToken.name;      // Name from the token
        const contactNo = decodedToken.contact;
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('contactNo', contactNo);
        // Set success message
        setMessage("Login successful!");

        if(username==='admin@example.com') {
          navigate('/admin/carlist');
          window.location.reload();
        } else {
          navigate('/'); 
          window.location.reload();
        }
      })
      .catch((error) => {
        // Clear previous messages
        setMessage("");

        if (error.response && error.response.data) {
          const errorData = error.response.data;

          // Handle multiple validation errors
          if (Array.isArray(errorData)) {
            const newErrors = {
              email: "",
              password: "",
            };

            errorData.forEach((errorMsg) => {
              if (errorMsg.includes("Email")) {
                newErrors.email = errorMsg;
              } else if (errorMsg.includes("Password")) {
                newErrors.password = errorMsg;
              } else {
                setMessage(errorMsg); // Display general error messages like "User not found"
              }
            });

            setErrors(newErrors);
          } else {
            setMessage("Login failed. Please try again.");
          }
        } else {
          setMessage("Login failed. Please try again.");
        }
      });
  };

  return (
    <div className="login-container">
      <div className="form-wrapper">
        <h1 className="form-heading">LOGIN TO YOUR ACCOUNT</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-grouplogin">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="input-grouplogin">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          <button type="submit" className="submit-btn">Login</button>
        </form>

        {message && <p className="response-message">{message}</p>}

        <p className="switch-form-text">
          Don't have an account? <Link to="/register">Sign up here</Link>
        </p>

        {/* Forgot Password Link */}
        <p className="forgot-password-link">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
