import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css'; // External CSS file for styling

const Home = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [error, setError] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [carModelFilter, setCarModelFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [prevSearchParams, setPrevSearchParams] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const currentSearchParams = `${startDate}-${endDate}`;

    if (currentSearchParams !== prevSearchParams) {
      fetchFilteredCars(startDate, endDate);
      setPrevSearchParams(currentSearchParams);
    }
  }, [location.search, prevSearchParams]);

  const fetchFilteredCars = async (startDate, endDate) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:9003/api/cars/filter', {
        params: { startDate, endDate },
      });
      setCars(response.data);
      setFilteredCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setError('Error fetching car details.');
    }
    setLoading(false);
  };

  const filterCars = (location, minPrice, maxPrice, carModel, startDate, endDate) => {
    let filtered = cars;
    if (location) {
      filtered = filtered.filter((car) => car.location === location);
    }
    if (minPrice) {
      filtered = filtered.filter((car) => car.price >= minPrice);
    }
    if (maxPrice) {
      filtered = filtered.filter((car) => car.price <= maxPrice);
    }
    if (carModel) {
      filtered = filtered.filter((car) =>
        car.carModel.toLowerCase().includes(carModel.toLowerCase())
      );
    }
    if (startDate && endDate) {
      filtered = filtered.filter((car) => {
        const carStartDate = new Date(car.startDate);
        const carEndDate = new Date(car.endDate);
        return carStartDate <= new Date(endDate) && carEndDate >= new Date(startDate);
      });
    }
    setFilteredCars(filtered);
  };

  const handleLocationFilterChange = (e) => {
    const selectedLocation = e.target.value;
    setLocationFilter(selectedLocation);
    filterCars(selectedLocation, minPrice, maxPrice, carModelFilter);
  };

  const handlePriceFilterChange = () => {
    filterCars(locationFilter, minPrice, maxPrice, carModelFilter);
  };

  const handleCarModelFilterChange = (e) => {
    const selectedModel = e.target.value;
    setCarModelFilter(selectedModel);
    filterCars(locationFilter, minPrice, maxPrice, selectedModel);
  };

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const exp = decodedToken.exp * 1000;
      return Date.now() > exp;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  const handleBookClick = (carId) => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      console.log('Token is expired or missing, redirecting to login...');
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      console.log('Token is valid, redirecting to payment...');
      
      const searchParams = new URLSearchParams(location.search);
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');

      const paymentUrl = `/payment/${carId}?startDate=${startDate}&endDate=${endDate}`;
      navigate(paymentUrl);
    }
  };

  return (
    <div className="home-container">
      <div className="filters-container">
        <div className="filters">
          <h5>Filter by Location</h5>
          <select
            value={locationFilter}
            onChange={handleLocationFilterChange}
            className="form-select"
          >
            <option value="">Choose Location</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Chennai">Chennai</option>
          </select>

          <h5>Filter by Price</h5>
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="form-input"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="form-input"
          />
          <button onClick={handlePriceFilterChange} className="apply-filter-button">
            Apply Price Filter
          </button>

          <h5>Filter by Car Model</h5>
          <input
            type="text"
            placeholder="Car Model"
            value={carModelFilter}
            onChange={handleCarModelFilterChange}
            className="form-input"
          />
        </div>
      </div>

      <div className="cars-container">
        {error && <p className="error-message">{error}</p>}
        {loading && <div className="loading-spinner">Loading...</div>}

        <div className="car-list">
          {filteredCars.length === 0 ? (
            <p>No cars available for the selected filters.</p>
          ) : (
            filteredCars.map((car) => (
              <div key={car.id} className="car-card">
                <img
                  src={`data:image/jpeg;base64,${car.image}`}
                  alt={car.carModel}
                  className="car-image"
                />
                <div className="car-details">
                  <h3>{car.carModel}</h3>
                  <p><strong>Location:</strong> {car.location}</p>
                  <p><strong>Price:</strong> ₹{car.price}</p>
                  <button onClick={() => handleBookClick(car.id)} className="btn-book">
                    Book
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
