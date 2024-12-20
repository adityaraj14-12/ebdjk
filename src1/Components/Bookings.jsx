import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';  // Correct import for jwtDecode

const Bookings = () => {
  const [carId, setCarId] = useState('');
  const [carModel, setCarModel] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [price, setPrice] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const { carId: passedCarId, carModel: passedCarModel, totalPrice, startDate: passedStartDate, endDate: passedEndDate } = location.state || {};

  // Pre-fill the booking form with the passed data from the previous page
  useEffect(() => {
    // Authentication Check
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    // Check token expiration
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

      if (decodedToken.exp < currentTime) {
        alert('Your session has expired. Please log in again.');
        navigate('/login');
        return;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      alert('Invalid token. Please log in again.');
      navigate('/login');
      return;
    }

    // If the user is authenticated, pre-fill the form
    if (passedCarId && passedCarModel) {
      setCarId(passedCarId);
      setCarModel(passedCarModel);
      setPrice(totalPrice);
      setStartDate(passedStartDate);
      setEndDate(passedEndDate);
      setUserEmail(localStorage.getItem('username')); // Assuming the email is stored in localStorage
    } else {
      // If no data is passed, redirect back to the payment page or show an error
      navigate('/payment');
    }
  }, [navigate, passedCarId, passedCarModel, totalPrice, passedStartDate, passedEndDate]);

  // Handle the booking form submission
  const handleBookingSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to make a booking.');
      return;
    }

    const bookingData = {
      carId,
      carModel,
      startDate,
      endDate,
      price,
      userEmail,
    };

    try {
      const response = await axios.post(
        'http://localhost:9004/api/bookings/create',
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Booking successful', response.data);
      alert('Booking created successfully!');
    } catch (error) {
      console.error('Error creating booking:', error.response?.data || error);
      alert('Failed to create booking. Please try again.');
    }
  };

  return (
    <div>
      <h2>Confirm Booking</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>Car Model</label>
          <p>{carModel}</p>
        </div>
        <div>
          <label>Price</label>
          <p>{price}</p>
        </div>
        <div>
          <label>Your Email</label>
          <p>{userEmail}</p>
        </div>
        <div>
          <label>Start Date</label>
          <p>{startDate}</p>
        </div>
        <div>
          <label>End Date</label>
          <p>{endDate}</p>
        </div>
        <button type="button" onClick={handleBookingSubmit}>
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default Bookings;
