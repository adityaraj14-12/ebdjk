import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Components/Register';
import Login from './Components/Login';
import Navbar from './Components/Navbar'; // Import the Navbar
import Footer from './Components/Footer'; // Import the Footer
import './App.css'; // Global styles for layout
import CarList from './Components/CarList';
import CreateOrEditCar from './Components/CreateOrEditCar';
import CarForm from './Components/CarForm';
import Home from './Components/Home';
import SearchPage from './Components/SearchPage';
import Payment from './Components/Payment';
import Profile from './Components/Profile';  // Import Profile component
import AboutUs from './Components/AboutUs';
import ContactUs from './Components/ContactUs';
import Bookings from './Components/Bookings';
import BookingsList from './Components/BookingsList';
import ResetPassword from './Components/ResetPassword';
import ForgotPassword from './Components/ForgotPassword';

function App() {
  return (
    <Router>
      <div className="page-container">
        <Navbar /> {/* Navbar at the top */}
        
        <div className="content-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<SearchPage />} />
            <Route path="/car-results" element={<Home />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/booking" element={<Bookings/>}/>
            <Route path="/payment/:carId" element={<Payment />} />
             <Route path="/admin/carlist" element={<CarList/>}/>
             <Route path="/admin/carform" element={<CarForm/>}/>
            {/* Update profile route to be accessible */}
            <Route path="/profile" element={<Profile />} />  {/* No username required in URL anymore */}
            <Route path="/bookings" element={<BookingsList />} />
            <Route path="/reset-password" element={<ResetPassword/>}/>
            <Route path="/forgot-password" element={<ForgotPassword/>}/>
          </Routes>
        </div>

        <Footer /> {/* Footer at the bottom */}
      </div>
    </Router>
  );
}

export default App;
