import React, { useState, useEffect } from 'react';
import ConfirmModal from './ConfirmModal';
import './BookingForm.css';

const BookingForm = ({ roomId, start: propStart, end: propEnd, description: propDescription, onBookingComplete, setShowBookingForm }) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (1) {
      const startDate = new Date(propStart);
      const endDate = new Date(propEnd);

      setDate(startDate.toLocaleDateString('en-GB').split('/').join('.'));
      setStartTime(startDate.toTimeString().split(' ')[0].slice(0, 5));
      setEndTime(endDate.toTimeString().split(' ')[0].slice(0, 5));
      setDescription(propDescription || ''); // Initialize description with propDescription or empty string

    }
  }, [propStart, propEnd]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    const formattedDate = date.split('.').reverse().join('-');
    const start = `${formattedDate}T${startTime}:00Z`;
    const end = `${formattedDate}T${endTime}:00Z`;
    const startTimeDate = new Date(start);
    const endTimeDate = new Date(end);
    const timeslots = [];
    let currentStartTime = new Date(startTimeDate);
    
    while (currentStartTime < endTimeDate) {

      timeslots.push({
        room_timeslot_id: 1,
        room_id: parseInt(roomId),
        room_name: `room ${roomId}`, // Assuming room_name from roomId for simplicity
        timeslot_id: 1,
        start_time: currentStartTime.toISOString(),
        user_id: 1, // Assuming a fixed user ID for simplicity
        description: description // Include the description in timeslots
      });

      currentStartTime = new Date(currentStartTime.getTime() + 10 * 60000);
      
    }
    console.log(timeslots);
    onBookingComplete(timeslots);
    setShowConfirmation(false);
    setShowBookingForm(false); // Close the BookingForm modal
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label>Date:</label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-control"
            placeholder="21.05.2024"
            required
          />
        </div>
        <div className="form-group">
          <label>Start Time:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>End Time:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="modal-footer">
          <button type="submit" className="btn btn-primary">Book</button>
          <button type="button" className="btn btn-secondary" onClick={() => setShowBookingForm(false)}>Close</button>
        </div>
      </form>
      <ConfirmModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirm}
        startTime={startTime}
        endTime={endTime}
        date={date}
      />
    </div>
  );
};

export default BookingForm;
