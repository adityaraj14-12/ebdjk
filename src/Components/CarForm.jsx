import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";
import { useSpring, animated } from 'react-spring'; // For animations
import './carForm.css';

const CarForm = ({ initialData, onSubmit, onCancel }) => {
  const parseDate = (dateStr) => {
    return dateStr ? parse(dateStr, "dd-MM-yyyy", new Date()) : new Date();
  };

  const today = new Date(); // Set today's date
  const [formData, setFormData] = useState({
    carModel: initialData.carModel || "",
    location: initialData.location || "",
    price: initialData.price || "",
    startDate: parseDate(initialData.startDate) || today, // Default to today's date
    endDate: parseDate(initialData.endDate) || null, // End date initially set to null
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date, field) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      startDate: format(formData.startDate, "dd-MM-yyyy"),
      endDate: formData.endDate ? format(formData.endDate, "dd-MM-yyyy") : null,
    };
    onSubmit(formattedData);
  };

  const modalStyle = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    config: { tension: 220, friction: 26 },
  });

  return (
    <animated.form 
      onSubmit={handleSubmit} 
      className="p-4 bg-light shadow-lg rounded-lg" 
      style={modalStyle}
    >
      <h3 className="text-center mb-4 text-primary">Car Details Form</h3>

      <div className="mb-4">
        <label className="form-label">Car Model</label>
        <input
          type="text"
          name="carModel"
          className="form-control input-animation"
          value={formData.carModel}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Location</label>
        <input
          type="text"
          name="location"
          className="form-control input-animation"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Price</label>
        <input
          type="number"
          name="price"
          className="form-control input-animation"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Start Date</label>
        <DatePicker
          selected={formData.startDate}
          onChange={(date) => handleDateChange(date, "startDate")}
          dateFormat="dd-MM-yyyy"
          className="form-control input-animation"
          required
          minDate={today} // Disable past dates
        />
      </div>

      {/* Show End Date only if Start Date is selected */}
      {formData.startDate && (
        <div className="mb-4">
          <label className="form-label">End Date</label>
          <DatePicker
            selected={formData.endDate}
            onChange={(date) => handleDateChange(date, "endDate")}
            dateFormat="dd-MM-yyyy"
            className="form-control input-animation"
            required
            minDate={formData.startDate} // Block dates before the selected Start Date
          />
        </div>
      )}

      <div className="mb-4">
        <label className="form-label">Image</label>
        <input
          type="file"
          className="form-control input-animation"
          onChange={handleFileChange}
          required
        />
      </div>

      <div className="d-flex justify-content-between mt-3">
        <button type="submit" className="btn btn-primary btn-lg btn-animation">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-lg btn-animation"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </animated.form>
  );
};

export default CarForm;
