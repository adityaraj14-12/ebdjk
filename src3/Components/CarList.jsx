import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CarForm from './CarForm';
import './CarList.css'; // Import custom CSS

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editCar, setEditCar] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [bookings, setBookings] = useState([]); // State for booking data
  const [showBookings, setShowBookings] = useState(false); // State to toggle the visibility of bookings

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:9003/api/cars', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setAlertMessage('Error fetching cars!');
    }
  };

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:9004/api/bookings/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Bookings Data:', response.data); // Log to check the structure of the data
      setBookings(response.data); // Set bookings data
      setShowBookings(true); // Show the bookings table
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setAlertMessage('Error fetching bookings!');
    }
  };
  
  const deleteCar = (id) => {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:9003/api/cars/delete/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
      fetchCars();
    })
    .catch(error => {
      setAlertMessage('Failed to delete car');
    });
  };

  const handleFormSubmit = async (formData) => {
    const token = localStorage.getItem('token');
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      if (editCar) {
        await axios.put(`http://localhost:9003/api/cars/edit/${editCar.id}`, data, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setAlertMessage('Car updated successfully!');
      } else {
        await addNewCar(data);
      }
      setShowModal(false);
      setEditCar(null);
      fetchCars();
    } catch (error) {
      setAlertMessage('Error submitting form!');
    }
  };

  const addNewCar = async (data) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:9003/api/cars/add', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setAlertMessage('Car added successfully!');
    } catch (error) {
      setAlertMessage('Error adding car!');
    }
  };

  const handleEdit = (car) => {
    setEditCar(car);
    setShowModal(true);
  };

  return (
    <div className="container">
      <h1>Manage Cars</h1>
      <div className="text-end mb-3">
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditCar(null);
            setShowModal(true);
          }}
        >
          Add New Car
        </button>
        <button
          className="btn btn-info ms-2"
          onClick={fetchBookings}  // Fetch bookings when clicked
        >
          Show All Bookings
        </button>
      </div>

      {alertMessage && <div className="alert alert-info">{alertMessage}</div>}

      {/* Cars Table */}
      <table className="table table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Model</th>
            <th>Location</th>
            <th>Price</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id}>
              <td>{car.carModel}</td>
              <td>{car.location}</td>
              <td>{car.price}</td>
              <td>
                {car.image && (
                  <img
                    src={`data:image/jpeg;base64,${car.image}`}
                    alt={car.carModel}
                    className="img-fluid"
                    style={{ maxWidth: '100px', height: 'auto' }}
                  />
                )}
              </td>
              <td>
                <button className="btn btn-warning" onClick={() => handleEdit(car)}>Edit</button>
                <button className="btn btn-danger" onClick={() => deleteCar(car.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {cars.length === 0 && <div className="alert alert-info text-center">No cars available.</div>}

      {/* Car Form Modal */}
      {showModal && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editCar ? 'Edit Car' : 'Add New Car'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <CarForm
                  initialData={editCar || {}}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setShowModal(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show the bookings if fetched */}
      {showBookings && bookings.length > 0 && (
        <div className="mt-4">
          <h2>Bookings</h2>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Car Model</th>
                <th>Email</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index}>
                  <td>{booking.carModel}</td>
                  <td>{booking.userEmail}</td>
                  <td>{booking.startDate}</td>

                  
                  <td>{booking.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CarList;
