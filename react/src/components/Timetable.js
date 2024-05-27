import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from './Modal';
import ConfirmModal from './ConfirmModal';
import BookingForm from './BookingForm';
import { useAuth } from '../context/AuthContext';
import './Timetable.css';

const Timetable = () => {
  const { roomId } = useParams();
  const { authTokens } = useAuth();
  const [events, setEvents] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalStartDate, setModalStartDate] = useState(null);
  const [modalEndDate, setModalEndDate] = useState(null);
  const [description, setDescription] = useState('');

  // Sample data
  const data = [
    {
      "room_timeslot_id": 7,
      "room_id": 6,
      "room_name": "room 3333",
      "timeslot_id": 2,
      "start_time": "2024-05-22T10:00:00Z",
      "user_id": 1,
      "description": "Meeting"
    },
    {
      "room_timeslot_id": 8,
      "room_id": 6,
      "room_name": "room 3333",
      "timeslot_id": 2,
      "start_time": "2024-05-22T10:10:00Z",
      "user_id": 1,
      "description": "Meeting"
    },
    {
      "room_timeslot_id": 9,
      "room_id": 6,
      "room_name": "room 3333",
      "timeslot_id": 2,
      "start_time": "2024-05-22T10:20:00Z",
      "user_id": 1,
      "description": "Meeting"
    },
    {
      "room_timeslot_id": 10,
      "room_id": 6,
      "room_name": "room 3333",
      "timeslot_id": 3,
      "start_time": "2024-05-22T11:00:00Z",
      "user_id": 2,
      "description": "Workshop"
    },
    {
      "room_timeslot_id": 11,
      "room_id": 6,
      "room_name": "room 3333",
      "timeslot_id": 4,
      "start_time": "2024-05-22T13:00:00Z",
      "user_id": 3,
      "description": "Lecture"
    },
    {
      "room_timeslot_id": 12,
      "room_id": 6,
      "room_name": "room 4444",
      "timeslot_id": 5,
      "start_time": "2024-05-23T09:00:00Z",
      "user_id": 4,
      "description": "Conference"
    }
  ];

  const createEvents = (timeslots) => {
    if (!timeslots || timeslots.length === 0) return [];

    // Sort timeslots by start time
    timeslots.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

    const mergedEvents = [];
    let currentEvent = {
      id: timeslots[0].room_timeslot_id,
      title: 'Available',
      start: timeslots[0].start_time,
      end: new Date(new Date(timeslots[0].start_time).getTime() + 10 * 60000).toISOString(),
      description: timeslots[0].description,
      backgroundColor: 'blue',
      user_id: timeslots[0].user_id,
      room_name: timeslots[0].room_name
    };

    for (let i = 1; i < timeslots.length; i++) {
      const timeslot = timeslots[i];
      const previousEnd = new Date(currentEvent.end).getTime();
      const currentStart = new Date(timeslot.start_time).getTime();

      // Check if timeslot can be merged with the current event
      if (timeslot.user_id === currentEvent.user_id &&
          timeslot.description === currentEvent.description &&
          (currentStart - previousEnd) <= 10 * 60000) {
        // Extend the current event's end time
        currentEvent.end = new Date(currentStart + 10 * 60000).toISOString();
      } else {
        // Push the current event to mergedEvents and start a new event
        mergedEvents.push({ ...currentEvent });
        currentEvent = {
          id: timeslot.room_timeslot_id,
          title: 'Available',
          start: timeslot.start_time,
          end: new Date(new Date(timeslot.start_time).getTime() + 10 * 60000).toISOString(),
          description: timeslot.description,
          backgroundColor: 'blue',
          user_id: timeslot.user_id,
          room_name: timeslot.room_name
        };
      }
    }
    // Push the last event
    mergedEvents.push({ ...currentEvent });

    return mergedEvents;
  };

  useEffect(() => {
    const roomTimeslots = data.filter(timeslot => timeslot.room_id === parseInt(roomId));
    const events = createEvents(roomTimeslots);
    setEvents(prevEvents => [...prevEvents, ...events]);
    setEvents(events); 
  }, [roomId]);

  const handleDateSelect = (selectInfo) => {
    const start = selectInfo.startStr;
    const end = selectInfo.endStr;
    setModalStartDate(start);
    setModalEndDate(end);
    setShowBookingForm(true);
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setShowEventDetails(true);
  };

  const handleBookingFormClose = () => {
    setShowBookingForm(false);
    setSelectedEvent(null);
    setModalStartDate(null);
    setModalEndDate(null);
  };

  const handleEventDetailsClose = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  const handleBookingComplete = (newBooking) => {
    if (newBooking && Array.isArray(newBooking)) {
      const newEvents = createEvents(newBooking);
      setEvents((prevEvents) => [...prevEvents, ...newEvents]); 
    }
    handleBookingFormClose();
  };

  return (
    <div className="timetable-container">
      <div className="timetable-header">
        <h3>Room Timetable</h3>
        <button className="btn btn-primary book-room-button" onClick={() => setShowBookingForm(true)}>
          Book a Room
        </button>        
      </div>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        selectMirror={true}
        slotEventOverlap = {false}
        slotMinTime = {'08:00:00'}
        firstDay={1} // Set the first day of the week to Monday
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek,timeGridDay'
        }}
        // slotMinTime="08:00:00" // Set the start time for the visible range
        slotMaxTime={"23:00:00"} // Set the end time for the visible range
        events={events}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventContent={(eventInfo) => (
          <>
            <i>{eventInfo.event.description}</i>
            <p>{eventInfo.event.extendedProps.description}</p>
          </>
        )}
      />
      <Modal isOpen={showBookingForm} onClose={handleBookingFormClose}>
        <BookingForm
          roomId={roomId}
          start={modalStartDate}
          end={modalEndDate}
          onBookingComplete={handleBookingComplete}
          setShowBookingForm={setShowBookingForm}
        />
      </Modal>
      <Modal isOpen={showEventDetails} onClose={handleEventDetailsClose}>
        {selectedEvent && (
          <div>
            <h3>Event Details</h3>
            <p><strong>Start:</strong> {new Date(selectedEvent.start).toLocaleString()}</p>
            <p><strong>End:</strong> {new Date(selectedEvent.end).toLocaleString()}</p>
            <p><strong>Description:</strong> {selectedEvent.extendedProps.description}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Timetable;
