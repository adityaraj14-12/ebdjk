import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CarForm from './CarForm';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editCar, setEditCar] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const response = await axios.get('http://localhost:9001/api/cars');
    setCars(response.data);
  };

  const deleteCar = async (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      await axios.delete(`http://localhost:9001/api/cars/delete/${id}`);
      fetchCars();
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (editCar) {
        // Update an existing car using the new endpoint
        await axios.put(`http://localhost:9001/api/cars/edit/${editCar.id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setAlertMessage('Car updated successfully!'); // Show success alert
      } else {
        await addNewCar(data);
      }

      setShowModal(false); // Hide the modal after submission
      setEditCar(null); // Clear edit state
      fetchCars(); // Refresh the car list
    } catch (error) {
      console.error('Error submitting form:', error);
      setAlertMessage('Error submitting form!'); // Show error alert
    }
  };



  const addNewCar = async (data) => {
    try {
      await axios.post('http://localhost:9001/api/cars/add', data, {
        headers: {
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
    setEditCar(car); // Set the car to be edited
    setShowModal(true); // Show the modal
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Manage Cars</h1>
      
      <div className="text-end mb-3">
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditCar(null); // Clear edit state for adding a new car
            setShowModal(true);
          }}
        >
          Add New Car
        </button>
      </div>

      {/* Alert message */}
      {alertMessage && <div className="alert alert-info text-center">{alertMessage}</div>}

      {/* Car List Table */}
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
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(car)}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCar(car.id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {cars.length === 0 && (
        <div className="alert alert-info text-center">No cars available.</div>
      )}

      {/* Modal for Add/Edit Car */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editCar ? 'Edit Car' : 'Add New Car'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <CarForm
                  initialData={editCar || {}} // Pass edit data or empty for new
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowModal(false);
                    setEditCar(null); // Clear edit state
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarList;
