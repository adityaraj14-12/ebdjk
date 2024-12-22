import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CarForm from './CarForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from 'react-spring'; // Import react-spring for animation
import './carList.css'; // Custom CSS file for additional styling

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [editCar, setEditCar] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username !== 'admin@example.com') {
      // Redirect if the user is not logged in as admin
      navigate('/login');  
      // Replace with your desired path for non-admin users
    }
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:9090/api/cars', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setAlertMessage('Error fetching cars!');
    }
  };

  const handleFormSubmit = async (formData) => {
    const token = localStorage.getItem('token');
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (editCar) {
        await axios.put(`http://localhost:9090/api/cars/edit/${editCar.id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
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
      console.error('Error submitting form:', error);
      setAlertMessage('Error submitting form!');
    }
  };

  const addNewCar = async (data) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:9090/api/cars/add', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setAlertMessage('Car added successfully!');
    } catch (error) {
      console.error('Error adding car:', error);
      setAlertMessage('Error adding car!');
    }
  };

  const handleEdit = (car) => {
    setEditCar(car);
    setShowModal(true);
  };

  const deleteCar = (id) => {
    const token = localStorage.getItem('token');
    axios
      .delete(`http://localhost:9090/api/cars/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(`Car with ID ${id} deleted successfully`);
        fetchCars();
      })
      .catch((error) => {
        console.error('Failed to delete car:', error);
        setAlertMessage('Failed to delete car');
      });
  };

  const goToBookings = () => {
    navigate('/bookings');
  };

  const modalStyle = useSpring({
    opacity: showModal ? 1 : 0,
    transform: showModal ? 'translateY(0)' : 'translateY(-100px)',
    config: { tension: 200, friction: 15 },
  });

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4 text-primary">Manage Cars</h1>

      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-success btn-lg btn-animated"
          onClick={() => {
            setEditCar(null);
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus-circle"></i> Add New Car
        </button>
        <button
          className="btn btn-info btn-lg btn-animated"
          onClick={goToBookings}
        >
          <i className="bi bi-calendar-check"></i> Show All Bookings
        </button>
      </div>

      {alertMessage && (
        <div className="alert alert-info text-center">{alertMessage}</div>
      )}

      <animated.table
        className="table table-bordered table-hover table-striped"
        style={{ animation: 'fadeIn 1s ease-out' }}
      >
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
            <tr key={car.id} className="animated fadeIn car-row">
              <td>{car.carModel}</td>
              <td>{car.location}</td>
              <td>{car.price}</td>
              <td>
                {car.image && (
                  <img
                    src={`data:image/jpeg;base64,${car.image}`}
                    alt={car.carModel}
                    className="img-fluid car-image"
                    style={{
                      maxWidth: '100px',
                      height: 'auto',
                      borderRadius: '10px',
                    }}
                  />
                )}
              </td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2 btn-animated"
                  onClick={() => handleEdit(car)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm btn-animated"
                  onClick={() => deleteCar(car.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </animated.table>

      {cars.length === 0 && (
        <div className="alert alert-info text-center">No cars available.</div>
      )}

      {showModal && (
        <animated.div
          className="modal show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            ...modalStyle,
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title">{editCar ? 'Edit Car' : 'Add New Car'}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <CarForm
                  initialData={editCar || {}}
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowModal(false);
                    setEditCar(null);
                  }}
                />
              </div>
            </div>
          </div>
        </animated.div>
      )}
    </div>
  );
};

export default CarList;
