import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { motion } from 'framer-motion';
import './SearchPage.css';

const SearchPage = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // Handle the search action
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

  // Format the date to yyyy-MM-dd for the backend query
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
    <div className={`search-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <motion.div
        className="search-box"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="search-title">Search for Available Cars</h1>
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
        
        <div className="date-inputs">
          <motion.div className="input-groupcalendar" whileHover={{ scale: 1.05 }}>
            <label className="input-label">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select Start Date"
              className="date-input"
              minDate={new Date()}
            />
            {startDateError && <p className="error-message">{startDateError}</p>}
          </motion.div>

          <motion.div className="input-groupcalendar" whileHover={{ scale: 1.05 }}>
            <label className="input-label">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select End Date"
              className="date-input"
              minDate={startDate || new Date()}
            />
            {endDateError && <p className="error-message">{endDateError}</p>}
          </motion.div>
        </div>

        <motion.button
          className="search-button"
          onClick={handleSearch}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {loading ? 'Searching...' : 'SearchForResults →'}
        </motion.button>
        
      </motion.div>
    </div>
  );
};

export default SearchPage;
