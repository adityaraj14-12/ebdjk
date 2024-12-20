import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css"; // Import the CSS file

const Profile = () => {
  const [username, setUsername] = useState("");
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      navigate("/login");
    } else {
      setUsername(storedUsername);
      fetchBookings(storedUsername);
    }
  }, [navigate]);

  const fetchBookings = async (username) => {
    try {
      const response = await axios.get("http://localhost:9090/api/bookings/carDetails", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Welcome, {username}!</h1>
      <h2>Your Booked Cars</h2>
      {bookings.length > 0 ? (
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Booking Id</th>
              <th>Car Model</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.carModel}</td>
                <td>{booking.startDate}</td>
                <td>{booking.endDate}</td>
                <td>{booking.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-bookings">No bookings found.</p>
      )}
    </div>
  );
};

export default Profile;
