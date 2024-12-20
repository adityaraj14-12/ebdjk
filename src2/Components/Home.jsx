import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  // Fetch the startDate and endDate from the URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const currentSearchParams = `${startDate}-${endDate}`;

    // Only fetch cars if query params have changed or it's the first load
    if (currentSearchParams !== prevSearchParams) {
      fetchFilteredCars(startDate, endDate);
      setPrevSearchParams(currentSearchParams);
    }
  }, [location.search, prevSearchParams]);

  const fetchFilteredCars = async (startDate, endDate) => {
    if (loading) return; // Prevent multiple fetch requests
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

      // Redirect to the payment page
      const paymentUrl = `/payment/${carId}?startDate=${startDate}&endDate=${endDate}`;
      navigate(paymentUrl);
    }
  };

  return (
    <div>
      <h2>Available Cars</h2>

      <div className="filters">
        <div>
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
        </div>

        <div>
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
        </div>

        <div>
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

      {error && <p>{error}</p>}
      {loading && <div>Loading...</div>}

      <table>
        <thead>
          <tr>
            <th>Model</th>
            <th>Location</th>
            <th>Price</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCars.length === 0 ? (
            <tr>
              <td colSpan="5">No cars available for the selected filters.</td>
            </tr>
          ) : (
            filteredCars.map((car) => (
              <tr key={car.id}>
                <td>{car.carModel}</td>
                <td>{car.location}</td>
                <td>{car.price}</td>
                <td>
                  {car.image && (
                    <img
                      src={`data:image/jpeg;base64,${car.image}`}
                      alt={car.carModel}
                      style={{ width: '100px', height: 'auto' }}
                    />
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleBookClick(car.id)}
                    className="btn-book"
                  >
                    Book
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
