import React, { useState } from 'react';
import './ContactUs.css'; // Importing updated CSS for styling
import axios from 'axios';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [buttonText, setButtonText] = useState("Send Message"); // State for button text
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Sending..."); // Change button text to "Sending..."
    setResponseMessage(""); // Clear any previous response message

    try {
      const response = await axios.post("http://localhost:9090/api/contact/send", formData);
      setButtonText("Message Sent"); // Change button text to "Message Sent"
      setResponseMessage(response.data); // Set the response message
    } catch (error) {
      setButtonText("Message Not Sent"); // Change button text to "Message Not Sent"
      setResponseMessage("Failed to send the message."); // Set the error message
    }

    // Reset button text after 3 seconds
    setTimeout(() => {
      setButtonText("Send Message");
    }, 3000);
  };

  return (
    <div id="contact-us-container">
      <div className="contact-content">
        {/* Left Column: Contact Form */}
        <div className="form-container">
          <h2>Contact Us</h2>
          <p>We'd love to hear from you. Please fill out the form below, and we'll get back to you soon.</p>
          <form onSubmit={handleSubmit} id="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Enter the subject of your message"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Write your message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" id="submit-btn" disabled={buttonText === "Sending..."}>
              {buttonText}
            </button>
            {responseMessage && <div className="alert alert-info">{responseMessage}</div>}
          </form>
        </div>

        {/* Right Column: Contact Details */}
        <div className="contact-info-container">
          <div className="contact-details">
            <h3>Our Contact Information</h3>
            <div className="contact-detail">
              <h4>Business Address</h4>
              <p>1234 Main Street, City, Country</p>
            </div>

            <div className="contact-detail">
              <h4>Phone Number</h4>
              <p>(123) 456-7890</p>
            </div>

            <div className="contact-detail">
              <h4>Email</h4>
              <p>contact@gadichahiye.com</p>
            </div>
          </div>

          <div className="map-section">
            <h3>Our Location</h3>
            <div id="map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62243.190298429974!2d77.79241371856094!3d12.830388202464047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae745b4a8b90f7%3A0xf87ee58536a77baa!2sBagalur%2C%20Tamil%20Nadu%20635103!5e0!3m2!1sen!2sin!4v1734370357503!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: '0' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
