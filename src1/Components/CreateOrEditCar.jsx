import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CreateOrEditCar = () => {
  const { id } = useParams(); // Get car ID from the URL (if editing)
  const navigate = useNavigate();
  const [car, setCar] = useState({
    carModel: '',
    location: '',
    price: '',
    startDate: '',
    endDate: '',
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCar();
    }
  }, [id]);

  const fetchCar = async () => {
    const response = await axios.get(`http://localhost:9003/api/cars/${id}`);
    setCar(response.data);
    setPreviewImage(`data:image/jpeg;base64,${response.data.image}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar({ ...car, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCar({ ...car, image: reader.result.split(',')[1] });
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await axios.put(`http://localhost:9003/api/cars/${id}`, car);
    } else {
      await axios.post('http://localhost:9003/api/cars', car);
    }
    navigate('/');
  };

  return (
    <div>
      <h1>{id ? 'Edit Car' : 'Create Car'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Car Model:</label>
          <input
            type="text"
            name="carModel"
            value={car.carModel}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={car.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={car.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={car.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={car.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewImage && <img src={previewImage} alt="Preview" width="100" />}
        </div>
        <button type="submit">{id ? 'Update Car' : 'Create Car'}</button>
      </form>
    </div>
  );
};

export default CreateOrEditCar;