import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './Payment.css';

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

  // Helper function to convert dd-mm-yyyy to yyyy-mm-dd
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
        .get(`http://localhost:9090/api/cars/${carId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then((response) => {
          setCarDetails(response.data);
          console.log('Car details fetched:', response.data);  // Log car details
        })
        .catch((error) => {
          console.error('Error fetching car details:', error);
          if (error.response && error.response.status === 401) {
            navigate('/login');
          }
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
    console.log("Location passed to booking page:", carDetails.location); // Log location before passing it

    navigate('/booking', {
      state: {
        carId,
        carModel: carDetails.carModel,
        startDate,
        endDate,
        totalPrice,
        location: carDetails.location,  // Pass location here
      },
    });
    setPaymentCompleted(true);
  };

  if (!carDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div id="payment-page-container">
      <div id="overlay"></div>

      {!paymentCompleted ? (
        <div id="payment-card">
          <h1>Payment Page</h1>
          <div id="card-content">
            {carDetails.image && (
              <img
                id="car-image"
                src={`data:image/jpeg;base64,${carDetails.image}`}
                alt={carDetails.carModel}
              />
            )}
            <h5>Username: {localStorage.getItem('username')}</h5>
            <h5>Car Model: {carDetails.carModel}</h5>
            <h5>Location: {carDetails.location}</h5>
            <h5>Price per day: ${carDetails.price}</h5>
            <div className="dates-price">
              <h5 className="label">Booking Dates:</h5>
              <p>{startDate} to {endDate}</p>
            </div>
            {startDate && endDate && <h5>Total Price: ${totalPrice}</h5>}
            <button id="payment-button" onClick={handlePayment}>
              Proceed to Payment
            </button>
          </div>
        </div>
      ) : (
        <div id="payment-success">
          <h1>Payment Successful</h1>
          <p>Congratulations, {username}! Your car booking is confirmed.</p>
          <Link to="/" className="btn">
            Go to Home Page
          </Link>
        </div>
      )}
    </div>
  );
};

export default Payment;
