import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import { TailSpin } from 'react-loader-spinner';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [error, setError] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]); // Price range [minPrice, maxPrice]
  const [carModelFilter, setCarModelFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState('none');
  const location = useLocation();
  const navigate = useNavigate();
  const [prevSearchParams, setPrevSearchParams] = useState('');
  const [locations, setLocations] = useState([]);

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

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get('http://localhost:9090/api/cars/getCarLocation');
        if (res.data && Array.isArray(res.data)) {
          setLocations(res.data);
        } else {
          console.log('Location data is empty or invalid format');
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchLocations();
  }, []);

  const fetchFilteredCars = async (startDate, endDate) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:9090/api/cars/filter', {
        params: { startDate, endDate },
      });

      if (sessionStorage.getItem('username') === 'admin@example.com') {
        navigate('/login');
      }
      setCars(response.data);
      setFilteredCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setError('Error fetching car details.');
    }
    setLoading(false);
  };

  const filterCars = (location, priceRange, carModel, startDate, endDate) => {
    let filtered = cars;
    const [minPrice, maxPrice] = priceRange;
  
    // Apply filters based on location, price range, car model, and dates
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
  
    // Sorting based on the selected option
    if (sortOption === 'low-to-high') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'high-to-low') {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }
  
    // Update the filtered cars state
    setFilteredCars(filtered);
  };
 
  
  const handleLocationFilterChange = (e) => {
    const selectedLocation = e.target.value;
    setLocationFilter(selectedLocation);
    filterCars(selectedLocation, priceRange, carModelFilter);
  };

  const handlePriceRangeChange = (e) => {
    const value = e.target.value.split(',').map(Number);
    setPriceRange(value);
    filterCars(locationFilter, value, carModelFilter);
  };

  const handleCarModelFilterChange = (e) => {
    const selectedModel = e.target.value;
    setCarModelFilter(selectedModel);
    filterCars(locationFilter, priceRange, selectedModel);
  };
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    filterCars(locationFilter, priceRange, carModelFilter);

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
    const token = sessionStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      console.log('Token is expired or missing, redirecting to login...');
      sessionStorage.removeItem('token');
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
    <div className="home-page">
      <div className="filter-section">
        <h4 className="filter-title">Filters</h4>

        <select
          id="location-filter"
          value={locationFilter}
          onChange={handleLocationFilterChange}
          className="filter-input"
        >
          <option value="">Select Location</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
        <input
          id="car-model-filter"
          type="text"
          placeholder="Car Model"
          value={carModelFilter}
          onChange={handleCarModelFilterChange}
          className="filter-input"
        />
        <select
          id="sort-by-price"
          value={sortOption}
          onChange={handleSortChange}
          className="filter-input"
        >
          <option value="none">Sort by Price: None</option>
          <option value="low-to-high">Sort by Price: Low to High</option>
          <option value="high-to-low">Sort by Price: High to Low</option>
        </select>

        <div className="price-range">
          <label htmlFor="price-range">Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</label>
          <input
            id="price-range"
            type="range"
            min="0"
            max="10000"
            step="100"
            value={priceRange.join(',')}
            onChange={handlePriceRangeChange}
            className="filter-input"
          />
        </div>

       

        
      </div>

      <div className="cars-display">
        {error && <p className="error-message">{error}</p>}
        {loading && (
          <div className="loading-spinner">
            <center>
              <TailSpin
                visible={true}
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </center>
          </div>
        )}

        <div className="car-cards-container">
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
                <div className="car-info">
                  <h3 className="car-title">{car.carModel}</h3>
                  <p className="car-location">
                    <strong>Location:</strong> {car.location}
                  </p>
                  <p className="car-price">
                    <strong>Price:</strong> ₹{car.price}
                  </p>
                  <button
                    id={`book-car-${car.id}`}
                    onClick={() => handleBookClick(car.id)}
                    className="book-button"
                  >
                    Book Now
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
