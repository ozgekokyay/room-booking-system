import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import Modal from './Modal';
import BookingForm from './BookingForm';
import { useAuth } from '../context/AuthContext';
import './Timetable.css';

const Timetable = ({ roomId }) => {
  const { authTokens } = useAuth();
  const [events, setEvents] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalStartDate, setModalStartDate] = useState(null);
  const [modalEndDate, setModalEndDate] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`/api/bookings?roomId=${roomId}`, {
          headers: { Authorization: `Bearer ${authTokens}` }
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching bookings', error);
      }
    };

    fetchBookings();
  }, [authTokens, roomId]);

  const handleDateSelect = (selectInfo) => {
    setModalStartDate(selectInfo.startStr);
    setModalEndDate(selectInfo.endStr);
    setSelectedEvent({
      start: selectInfo.startStr,
      end: selectInfo.endStr,
    });
  };

  const handleBookingFormClose = () => {
    setShowBookingForm(false);
    setSelectedEvent(null);
    setModalStartDate(null);
    setModalEndDate(null);
  };

  const handleBookingComplete = (newEvent) => {
    setEvents([...events, newEvent]);
    handleBookingFormClose();
  };

  const openBookingFormManually = () => {
    setShowBookingForm(true);
  };

  return (
    <div className="timetable-container">
      <div className="timetable-header">
        <h3>Room Timetable</h3>
        <button className="btn btn-primary book-room-button" onClick={openBookingFormManually}>
          Book a Room
        </button>
      </div>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        selectMirror={true}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek,timeGridDay'
        }}
        events={events}
        select={handleDateSelect}
      />
      <Modal isOpen={showBookingForm} onClose={handleBookingFormClose}>
        <BookingForm
          roomId={roomId}
          start={modalStartDate}
          end={modalEndDate}
          onBookingComplete={handleBookingComplete}
        />
      </Modal>
    </div>
  );
};

export default Timetable;
