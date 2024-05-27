// src/components/RoomList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import './RoomList.css'; // Import CSS file

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('/roomslist/');
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms', error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="container"> {/* Add class names */}
      <h2 className="heading">Classrooms</h2>
      <ul className="roomList">
        {rooms.map((room) => (
          <li key={room.id} className="roomItem">
            <div>
              <Link to={`/timetable/${room.id}`} className="roomLink">
                {room.name}
              </Link>
              <div className="roomInfo">
                <p>Capacity: {room.room_type}</p>
                <p>Location: {room.location}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
