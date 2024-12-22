import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Register.css'; // Assuming you have this CSS file
 
 
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNo: "",
  });
 
  const Navigate=useNavigate();
 
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    contactNo: "",
  });
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
 
  const validateForm = () => {
    let formErrors = {};
 
    if (!formData.name) {
      formErrors.name = "Name is required";
    }
 
    if (!formData.email) {
      formErrors.email = "Email is required";
    }
 
    if (!formData.password) {
      formErrors.password = "Password is required";
    }
 
    if (!formData.contactNo) {
      formErrors.contactNo = "Contact number is required";
    }
 
    setErrors(formErrors);
 
    return Object.keys(formErrors).length === 0;
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
 
    setErrors({
      name: "",
      email: "",
      password: "",
      contactNo: "",
    });
 
    // Validate form
    if (!validateForm()) {
      return;
    }
 
    // Send form data to the backend
    axios
      .post("http://localhost:9090/api/auth/register", formData)
      .then((response) => {
        setMessage("Registration successful!");
        setFormData({
          name: "",
          email: "",
          password: "",
          contactNo: "",
        });
        Navigate("/login")
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          // Map the error messages coming from the backend to respective fields
          setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
 
            // Loop through the errors array sent from backend and map them to specific fields
            error.response.data.forEach((errorMsg) => {
              if (errorMsg.includes("Contact number")) {
                newErrors.contactNo = errorMsg;
              } else if (errorMsg.includes("Email")) {
                newErrors.email = errorMsg;  // Make sure 'Email already exists' is caught here
              } else if (errorMsg.includes("Password")) {
                newErrors.password = errorMsg;
              } else if (errorMsg.includes("Name")) {
                newErrors.name = errorMsg;
              }
            });
 
            return newErrors;
          });
        } else {
          setMessage("Registration failed. Please try again.");
        }
      });
  };
 
  return (
    <div className="register-container">
      <div className="form-wrapper">
        <h1 className="form-heading">Join the Elite Car Rental Experience</h1>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-groupregister">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>
 
          <div className="input-groupregister">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <p className="error-message">{errors.email}</p>} {/* Display email error here */}
          </div>
 
          <div className="input-groupregister">
            <label htmlFor="password">Password</label>
            <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                  title="Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character."
                  required
                />
 
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>
 
          <div className="input-groupregister">
            <label htmlFor="contactNo">Contact Number</label>
            <input
              type="text"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              placeholder="Enter your contact number"
            />
            {errors.contactNo && <p className="error-message">{errors.contactNo}</p>}
          </div>
 
          <button type="submit" className="submit-btn">Sign Up</button>
        </form>
 
        {message && <p className="response-message">{message}</p>}
 
        <p className="switch-form-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};
 
export default Register;
 