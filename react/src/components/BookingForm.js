import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './BookingForm.css';

const BookingForm = ({ roomId, start: propStart, end: propEnd, onBookingComplete }) => {
  const { authTokens } = useAuth();
  const [purpose, setPurpose] = useState('');
  const [start, setStart] = useState(propStart || '');
  const [end, setEnd] = useState(propEnd || '');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        '/api/bookings',
        {
          roomId,
          start,
          end,
          description: purpose,
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens}`,
          },
        }
      );
      onBookingComplete(response.data); // Assuming the response.data contains the updated bookings
    } catch (error) {
      console.error('Error creating booking', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <div className="form-group">
        <label>Start Date:</label>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label>End Date:</label>
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label>Purpose:</label>
        <input
          type="text"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="form-control"
          required
        />
      </div>
      <div className="modal-footer">
        <button type="submit" className="btn btn-primary">Confirm Booking</button>
        <button type="button" className="btn btn-secondary" onClick={onBookingComplete}>Close</button>
      </div>
    </form>
  );
};

export default BookingForm;
