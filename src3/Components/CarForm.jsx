import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";
import './CarForm.css'; // Custom CSS

const CarForm = ({ initialData, onSubmit, onCancel }) => {
  const parseDate = (dateStr) => {
    return dateStr ? parse(dateStr, "dd-MM-yyyy", new Date()) : new Date();
  };

  const [formData, setFormData] = useState({
    carModel: initialData.carModel || "",
    location: initialData.location || "",
    price: initialData.price || "",
    startDate: parseDate(initialData.startDate),
    endDate: parseDate(initialData.endDate),
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
      endDate: format(formData.endDate, "dd-MM-yyyy"),
    };

    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label className="form-label">Car Model</label>
        <input
          type="text"
          name="carModel"
          className="form-control"
          value={formData.carModel}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Location</label>
        <input
          type="text"
          name="location"
          className="form-control"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Price</label>
        <input
          type="number"
          name="price"
          className="form-control"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Start Date</label>
        <DatePicker
          selected={formData.startDate}
          onChange={(date) => handleDateChange(date, "startDate")}
          dateFormat="dd-MM-yyyy"
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">End Date</label>
        <DatePicker
          selected={formData.endDate}
          onChange={(date) => handleDateChange(date, "endDate")}
          dateFormat="dd-MM-yyyy"
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Image</label>
        <input
          type="file"
          className="form-control"
          onChange={handleFileChange}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CarForm;
