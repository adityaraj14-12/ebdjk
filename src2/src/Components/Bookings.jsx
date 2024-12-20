import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwtDecode

const Bookings = () => {
  const [carId, setCarId] = useState('');
  const [carModel, setCarModel] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [price, setPrice] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve passed data from location state (previous page)
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

    // Trim any extra spaces or newlines
    const trimmedStartDate = startDate.trim();
    const trimmedEndDate = endDate.trim();

    const bookingData = {
      carId,
      carModel,
      startDate: trimmedStartDate,
      endDate: trimmedEndDate,
      price,
      userEmail,
    };

    try {
      // Start a booking transaction
      const bookingResponse = await axios.post(
        'http://localhost:9004/api/bookings/create',
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Token from localStorage
          },
        }
      );
      console.log('Booking successful', bookingResponse.data);
      alert('Booking created successfully!');

      // Now, update the car's availability after successful booking
      try {
        console.log(`token` + token);
        const availabilityResponse = await axios.put(
          `http://localhost:9003/api/cars/update-availability/${carId}`,
          null,  // No request body, using query params instead
          {
            params: {
              bookedStartDate: trimmedStartDate,
              bookedEndDate: trimmedEndDate,
            },
            headers: {
              Authorization: `Bearer ${token}`,  // Ensure the token is passed here
            },
          }
        );
        console.log('Car availability updated', availabilityResponse.data);
        alert('Car availability updated successfully!');
        navigate('/'); // Navigate to the dashboard after successful booking
      } catch (error) {
        console.error('Error updating car availability:', error.response?.data || error);
        alert('Failed to update car availability. Please try again.');
      }

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
