import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

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
        })
        .catch((error) => {
          console.error('Error fetching car details:', error);
          if (error.response && error.response.status === 401) {
            navigate('/login');
          }
        });
    }

    // const storedUsername = localStorage.getItem('username');
    // const [storedUsername, setStoredUsername] = useState("");
    // console.log(storedUsername);
    // if (storedUsername) {
    //   setUsername(storedUsername);
    // }

    const queryParams = new URLSearchParams(location.search);
    const startDateFromURL = queryParams.get('startDate');
    const endDateFromURL = queryParams.get('endDate');

    if (startDateFromURL && endDateFromURL) {
      setStartDate(startDateFromURL);
      setEndDate(endDateFromURL);

      if (carDetails && carDetails.price) {
        const start = new Date(startDateFromURL);
        const end = new Date(endDateFromURL);
        const timeDifference = end - start;
        const daysDifference = timeDifference / (1000 * 3600 * 24);
        const totalPrice = (daysDifference + 1) * carDetails.price;
        setTotalPrice(totalPrice);
      }
    }
  }, [carId, navigate, carDetails, location.search]);

  const handlePayment = () => {
    console.log("handlePayment");
    // Redirect to booking page with the booking details as state
    setUsername(localStorage.getItem("username"));
    console.log(username);
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

  if (!carDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      {!paymentCompleted ? (
        <div>
          <h1 className="text-center">Payment Page</h1>
          <div className="card p-4 text-center">
            {carDetails.image && (
              <img
                src={`data:image/jpeg;base64,${carDetails.image}`}
                alt={carDetails.carModel}
                className="img-fluid mb-3"
                style={{
                  maxWidth: '150px',
                  height: 'auto',
                  margin: '0 auto',
                  display: 'block',
                }}
              />
            )}
            <h5>Username: {username}</h5>
            <h5>Car Model: {carDetails.carModel}</h5>
            <h5>Location: {carDetails.location}</h5>
            <h5>Price per day: ${carDetails.price}</h5>
            <h5>
              Booking Dates: {startDate} to {endDate}
            </h5>

            {startDate && endDate && <h5>Total Price: ${totalPrice}</h5>}

            <button
              className="btn btn-primary mt-3 w-100"
              onClick={handlePayment}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-success">Payment Successful</h1>
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
