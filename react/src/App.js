// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup'; // Corrected this import
import RoomList from './components/RoomList';
import Timetable from './components/Timetable';
import PrivateRoute from './context/PrivateRoute';
import Home from './pages/Home';
import NotFound from './pages/NotFound'; // Import NotFound component


function App() {
  return (
    <Router>

      <AuthProvider>
        <Routes>
          <Route path="/register/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route
            path="/rooms"
            element={
                <RoomList />
            }
          />
          <Route
            path="/timetable/:roomId"
            element={
                <Timetable />
            }
          />
          <Route path="*" element={<NotFound />} /> 
        </Routes>
      </AuthProvider>
    </Router>

  );
}

export default App;
