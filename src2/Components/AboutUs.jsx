import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <>
      <div className="about-us-container">
        <div className="about-us-content">
          <h1>About Us</h1>
          <p>
            We are a team of five passionate individuals from Bangalore who launched
            our car rental service on 15th December. Our mission is to provide seamless
            and affordable car rental experiences, tailored to meet your travel needs.
          </p>
          <div className="team">
            <h2>Our Team</h2>
            <ul>
              <li>Deepak</li>
              <li>Aditya</li>
              <li>Yashwant</li>
              <li>Gulshan</li>
              <li>Hitesh</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
