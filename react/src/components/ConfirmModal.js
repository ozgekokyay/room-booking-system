import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, startTime, endTime, date }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal">
        <p>Are you sure you want to book the room from {startTime} to {endTime} on {date}?</p>
        <button className="btn btn-primary" onClick={onConfirm}>Confirm</button>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmModal;
