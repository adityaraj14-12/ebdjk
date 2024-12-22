import React, { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Fetch bookings when the component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
        const response = await axios.get("http://localhost:9090/api/bookings/allBookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(response.data);
      } catch (err) {
        setError(`Failed to fetch bookings`);
        alert('You do not have access');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="alert alert-danger text-center mt-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">All Bookings</h1>
      {bookings.length === 0 ? (
        <div className="alert alert-info text-center">No bookings available</div>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Car Model</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Price</th>
              <th>User Email</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.carModel}</td>
                <td>{booking.startDate}</td>
                <td>{booking.endDate}</td>
                <td>{booking.price}</td>
                <td>{booking.userEmail}</td>
                <td>{booking.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingsList;
