import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SearchPage.css'; // Import the custom CSS

const SearchPage = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in and is not an admin
  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username === 'admin@example.com') {
      // Redirect if the user is not logged in as admin
      navigate('/login');  // Replace with your desired path for non-admin users
    }
  }, [navigate]);

  const handleSearch = () => {
    setLoading(true);
    setStartDateError('');
    setEndDateError('');

    if (!startDate || !endDate) {
      if (!startDate) {
        setStartDateError('Please select a start date.');
      }
      if (!endDate) {
        setEndDateError('Please select an end date.');
      }
      setLoading(false);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDateNormalized = new Date(startDate);
    startDateNormalized.setHours(0, 0, 0, 0);

    if (startDateNormalized < today) {
      setStartDateError('Start date must be today or in the future.');
      setLoading(false);
      return;
    }

    const endDateNormalized = new Date(endDate);
    endDateNormalized.setHours(0, 0, 0, 0);

    if (endDateNormalized <= startDateNormalized) {
      setEndDateError('End date must be after the start date.');
      setLoading(false);
      return;
    }

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    setTimeout(() => {
      navigate(`/car-results?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
      setLoading(false);
    }, 1000);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`container-fluid p-0 ${isDarkMode ? 'bg-dark text-white' : 'bg-light'}`}>
      {/* Hero Section */}
      <div id="hero-section" className="text-center py-5">
        <motion.h1
          className="display-4 text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Rent Your Dream Car Today!
        </motion.h1>

        <p className="lead mb-4">Choose from a wide selection of cars at unbeatable prices</p>

        {/* Search Bar */}
        <div className="search-form-container">
          <div className="col-md-5">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Pick Start Date"
              className="date-picker"
              minDate={new Date()}
            />
            {startDateError && <p className="error-message">{startDateError}</p>}
          </div>

          <div className="col-md-5">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Pick End Date"
              className="date-picker"
              minDate={startDate || new Date()}
            />
            {endDateError && <p className="error-message">{endDateError}</p>}
          </div>
        </div>

        {/* Search Button */}
        <motion.button
          className="search-btn"
          onClick={handleSearch}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {loading ? 'Searching...' : 'Search for Results →'}
        </motion.button>
      </div>

      {/* Special Offers Section */}
      <div className="container py-5">
        <h2 className="text-center mb-4">Special Offers</h2>
        <div className="row">
          {/* Card 1 */}
          <div className="col-md-4 mb-4">
            <div className="card card-size">
              <img src="https://kongres-magazine.eu/wp-content/uploads/2016/11/Special-Offer-.jpg" alt="Offer 1" className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">Discounts on SUVs</h5>
                <p className="card-text">Get 30% off on all SUV rentals this week.</p>
              </div>
            </div>
          </div>
          {/* Card 2 */}
          <div className="col-md-4 mb-4">
            <div className="card card-size">
              <img src="https://img.freepik.com/premium-vector/weekend-special-sale-tag-banner-design-template-marketing-special-offer-promotion-retail_680598-238.jpg" alt="Offer 2" className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">Weekend Deals</h5>
                <p className="card-text">Book a car for the weekend and save big!</p>
              </div>
            </div>
          </div>
          {/* Card 3 */}
          <div className="col-md-4 mb-4">
            <div className="card card-size">
              <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/car-best-offer-design-template-52ed552c5b15d829239ae8f5448ab282_screen.jpg?ts=1674382224" alt="Offer 3" className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">Luxury Car Rentals</h5>
                <p className="card-text">Drive your dream luxury car at a special price!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Cars Section */}
      <div className="container py-5">
        <h2 className="text-center mb-4">Featured Cars</h2>
        <div className="row">
          {/* Card 1 */}
          <div className="col-md-4 mb-4">
            <div className="card card-size">
              <img src="https://www.sagmart.com/uploads/2015/11/25/news_image1/Mahindra-XUV500-Image.jpg" alt="Car 1" className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">SUV - Rs.5999/day</h5>
                <p className="card-text">Perfect for your next adventure.</p>
              </div>
            </div>
          </div>
          {/* Card 2 */}
          <div className="col-md-4 mb-4">
            <div className="card card-size">
              <img src="https://static1.hotcarsimages.com/wordpress/wp-content/uploads/2022/07/2022_Lexus_IS_350_001-Cropped.jpg" alt="Car 2" className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">Luxury Sedan - Rs.7499/day</h5>
                <p className="card-text">Experience the ultimate in comfort and style.</p>
              </div>
            </div>
          </div>
          {/* Card 3 */}
          <div className="col-md-4 mb-4">
            <div className="card card-size">
              <img src="https://static3.hotcarsimages.com/wordpress/wp-content/uploads/2019/07/feature-luxury-sport-car.jpg" alt="Car 3" className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">Sports Car - Rs.9999/day</h5>
                <p className="card-text">Feel the thrill of driving a sports car.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
