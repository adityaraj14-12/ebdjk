import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './Bookings.css'; // Specific CSS for Bookings
 
const Bookings = () => {
  const [carId, setCarId] = useState('');
  const [carModel, setCarModel] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [price, setPrice] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card'); // State for payment method selection
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showQR, setShowQR] = useState(false); // State for UPI QR display
 
  const location = useLocation();
  const navigate = useNavigate();
 
  const { carId: passedCarId, carModel: passedCarModel, totalPrice, startDate: passedStartDate, endDate: passedEndDate } = location.state || {};
 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
 
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
 
      if (decodedToken.exp < currentTime) {
        alert('Your session has expired. Please log in again.');
        navigate('/login');
        return;
      }
    } catch (error) {
      alert('Invalid token. Please log in again.');
      navigate('/login');
      return;
    }
 
    if (passedCarId && passedCarModel) {
      setCarId(passedCarId);
      setCarModel(passedCarModel);
      setPrice(totalPrice);
      setStartDate(passedStartDate);
      setEndDate(passedEndDate);
      setUserEmail(localStorage.getItem('username'));
    } else {
      navigate('/payment');
    }
  }, [navigate, passedCarId, passedCarModel, totalPrice, passedStartDate, passedEndDate]);
 
  useEffect(() => {
    if (paymentMethod === 'upi') {
      setShowQR(true); // Immediately show the QR code when UPI is selected
 
      // Simulate UPI payment process after 15 seconds
      const timer = setTimeout(() => {
        setShowQR(false); // Hide the QR code
        handleBookingSubmit(); // Trigger the booking submit after the delay
 
        // Navigate to the profile page after booking
        navigate('/profile');
        window.location.reload();
      }, 15000); // Fake 15-second delay for UPI payment
 
      // Clear timeout if the payment method changes before the 15 seconds is up
      return () => clearTimeout(timer);
    }
  }, [paymentMethod, navigate]); // This hook runs when the payment method changes
 
  const handleBookingSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to make a booking.');
      return;
    }
 
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
      setLoading(true);
      if (paymentMethod === 'card') {
        // Simulate Card Payment Process
        const paymentResponse = await new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 2000)
        );
       
        if (paymentResponse.success) {
          setPaymentSuccess(true);
          alert('Booking created successfully with card payment!');
          setLoading(false);
        } else {
          alert('Payment failed. Please try again.');
          setLoading(false);
        }
      } else if (paymentMethod === 'upi') {
        // The booking will be triggered after the 15-second timeout for UPI
        // You don't need to do anything here as the booking submit happens automatically
      }
 
      // Call API to store booking data
      const bookingResponse = await axios.post(
        'http://localhost:9004/api/bookings/create',
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
 
    navigate("/profile")
      console.log('Booking successful', bookingResponse.data);
    } catch (error) {
      setLoading(false);
      console.error('Error creating booking:', error.response?.data || error);
      alert('Failed to create booking. Please try again.');
    }
  };
 
  return (
    <div className="booking-container">
      <h2>Confirm Booking</h2>
      <form onSubmit={(e) => e.preventDefault()} className="booking-form">
       
        {/* Car Details */}
        <div className="form-group">
          <label>Car Model</label>
          <p>{carModel}</p>
        </div>
        <div className="form-group">
          <label>Price</label>
          <p>{price}</p>
        </div>
        <div className="form-group">
          <label>Your Email</label>
          <p>{userEmail}</p>
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <p>{startDate}</p>
        </div>
        <div className="form-group">
          <label>End Date</label>
          <p>{endDate}</p>
        </div>
 
        {/* Payment Method Selection */}
        <div className="payment-method">
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={() => setPaymentMethod('card')}
            />
            Credit/Debit Card
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              checked={paymentMethod === 'upi'}
              onChange={() => setPaymentMethod('upi')}
            />
            UPI
          </label>
        </div>
 
        {/* Conditional Rendering of Payment Method Form */}
        {paymentMethod === 'card' && (
          <div className="payment-details">
            <h3>Card Payment Details</h3>
            <div className="input-group">
              <div className="input-field">
                <label>Card Number</label>
                <input type="text" placeholder="**** **** **** ****" />
              </div>
              <div className="input-field">
                <label>Expiration Date</label>
                <input type="text" placeholder="MM/YY" />
              </div>
            </div>
            <div className="input-group">
              <div className="input-field">
                <label>CVV</label>
                <input type="text" placeholder="***" />
              </div>
            </div>
          </div>
        )}
 
        {/* UPI Payment Section with Fake QR */}
        {paymentMethod === 'upi' && (
          <div className="upi-payment">
            <h3>Scan UPI QR Code to Pay</h3>
            {showQR ? (
              <div className="fake-qr-code">
                <img src="https://www.scam-detector.com/wp-content/uploads/2020/08/blog-1476137605.jpg" alt="UPI QR Code" />
                <p>Scan this code with your UPI app</p>
              </div>
            ) : (
              <p>Waiting for UPI payment...</p>
            )}
          </div>
        )}
 
        {paymentMethod === 'card' && (
          <button type="button" onClick={handleBookingSubmit} disabled={loading}>
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        )}
 
        {paymentSuccess && <p className="success-message">Payment successful!</p>}
      </form>
    </div>
  );
};
 
export default Bookings;