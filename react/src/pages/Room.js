// src/pages/Rooms.js

import React, { useEffect, useState } from 'react';
import { getRooms, createRoom, deleteRoom } from '../services/rooms';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      const roomsData = await getRooms();
      if (roomsData) {
        setRooms(roomsData);
      }
    };

    fetchRooms();
  }, []);

  const handleCreateRoom = async () => {
    const roomData = { name: newRoomName };
    const newRoom = await createRoom(roomData);
    if (newRoom) {
      setRooms([...rooms, newRoom]);
      setNewRoomName('');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    const deletedRoom = await deleteRoom(roomId);
    if (deletedRoom) {
      const updatedRooms = rooms.filter((room) => room.id !== roomId);
      setRooms(updatedRooms);
    }
  };

  return (
    <div className="rooms-container">
      <h2>Rooms</h2>
      <div>
        <input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="Enter new room name"
        />
        <button onClick={handleCreateRoom}>Create Room</button>
      </div>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.name}
            <button onClick={() => handleDeleteRoom(room.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Rooms;
