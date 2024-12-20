import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './SearchPage.css'; // Custom styles for the search page
import { motion } from 'framer-motion'; // Animation library for motion effects

const SearchPage = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();

  // Handle the search action
  const handleSearch = () => {
    // Check if both start and end dates are selected
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    // Format the selected dates to yyyy-MM-dd format for the backend
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    // Navigate to the results page with query parameters
    navigate(`/car-results?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
  };

  // Format the date to yyyy-MM-dd for the backend query
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`; // Format: yyyy-MM-dd
  };

  return (
    <div className="search-container">
      <motion.div
        className="search-box"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="search-title">Search for Available Cars</h1>
        
        {/* Start Date Picker */}
        <motion.div className="input-group" whileHover={{ scale: 1.05 }}>
          <label className="input-label">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy" // Show date as dd/MM/yyyy
            placeholderText="Select Start Date"
            className="date-input"
          />
        </motion.div>

        {/* End Date Picker */}
        <motion.div className="input-group" whileHover={{ scale: 1.05 }}>
          <label className="input-label">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy" // Show date as dd/MM/yyyy
            placeholderText="Select End Date"
            className="date-input"
          />
        </motion.div>

        {/* Search Button */}
        <motion.button
          className="search-button"
          onClick={handleSearch}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          Search
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SearchPage;
