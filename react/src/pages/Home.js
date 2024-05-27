// src/pages/Home.js
import RoomList from '../components/RoomList';
import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Home = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <h1>Room Booking System</h1>
      <RoomList />
      <button onClick={logoutUser}>Logout</button>
    </div>
  );
};

export default Home;
