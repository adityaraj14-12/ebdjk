import React, { useState } from "react";
import axios from "axios";  // Assuming you have custom styling
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    contactNo: "",
  });

  const [message, setMessage] = useState("");
  const Navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send a request to the backend to verify email and phone number
    axios
      .post("http://localhost:9090/api/auth/login/forgot-password", formData)
      .then((response) => {
        setMessage(response.data);
        Navigate("/reset-password")
        // Display success message
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setMessage(error.response.data[0] || "An error occurred.");
        }
      });
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactNo">Contact Number</label>
          <input
            type="text"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            required
          />
          {message && <p>{message}</p>}

                   </div>

        <button type="submit">Submit</button>
      </form>

          </div>
  );
};

export default ForgotPassword;
