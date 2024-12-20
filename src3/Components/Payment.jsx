import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './Payment.css'; // Include your custom styles for the payment page
 
const Payment = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
 
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [carDetails, setCarDetails] = useState(null);
  const [username, setUsername] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state
 
  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  };
 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
 
    if (carId) {
      axios
        .get(`http://localhost:9003/api/cars/${carId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then((response) => {
          setCarDetails(response.data);
          setLoading(false); // Stop loading once data is fetched
        })
        .catch((error) => {
          console.error('Error fetching car details:', error);
          if (error.response && error.response.status === 401) {
            navigate('/login');
          }
          setLoading(false); // Stop loading even if there is an error
        });
    }
 
    const queryParams = new URLSearchParams(location.search);
    const startDateFromURL = queryParams.get('startDate');
    const endDateFromURL = queryParams.get('endDate');
 
    if (startDateFromURL && endDateFromURL) {
      setStartDate(startDateFromURL);
      setEndDate(endDateFromURL);
 
      if (carDetails && carDetails.price) {
        const formattedStartDate = formatDate(startDateFromURL);
        const formattedEndDate = formatDate(endDateFromURL);
 
        const start = new Date(formattedStartDate);
        const end = new Date(formattedEndDate);
        const timeDifference = end - start;
        const daysDifference = timeDifference / (1000 * 3600 * 24);
 
        if (daysDifference >= 0) {
          const totalPrice = (daysDifference + 1) * carDetails.price;
          setTotalPrice(totalPrice);
        } else {
          setTotalPrice(0); // In case the date range is invalid (endDate before startDate)
        }
      }
    }
  }, [carId, navigate, carDetails, location.search]);
 
  const handlePayment = () => {
    setUsername(localStorage.getItem('username'));
    navigate('/booking', {
      state: {
        carId,
        carModel: carDetails.carModel,
        startDate,
        endDate,
        totalPrice,
      },
    });
    setPaymentCompleted(true);
  };
 
  if (loading) {
    return (
      <div className="payment-container">
        <div className="loading-spinner">Loading...</div> {/* Add spinner here */}
      </div>
    );
  }
 
  if (!carDetails) {
    return <div>Failed to load car details.</div>;
  }
 
  return (
    <div className="payment-container mt-4">
      {!paymentCompleted ? (
        <div className="payment-card">
          <h1 className="text-center text-gradient">Payment Page</h1>
          <div className="payment-details text-center">
            {carDetails.image && (
              <img
                src={`data:image/jpeg;base64,${carDetails.image}`}
                alt={carDetails.carModel}
                className="img-fluid car-image"
              />
            )}
            <h5 className="username">Username: {username}</h5>
            <h5 className="car-model">Car Model: {carDetails.carModel}</h5>
            <h5 className="car-location">Location: {carDetails.location}</h5>
            <h5 className="price-per-day">Price per day: ₹{carDetails.price}</h5>
            <h5>
              Booking Dates: {startDate} to {endDate}
            </h5>
 
            {startDate && endDate && <h5 className="total-price">Total Price: ₹{totalPrice}</h5>}
 
            <button
              className="btn btn-gradient proceed-btn"
              onClick={handlePayment}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      ) : (
        <div className="payment-success text-center">
          <h1 className="text-success animated-text">Payment Successful</h1>
          <p className="mt-3">
            Congratulations, {username}! Your car booking is confirmed.
          </p>
          <div>
            <Link to="/" className="btn btn-success mt-3">
              Go to Home Page
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default Payment;