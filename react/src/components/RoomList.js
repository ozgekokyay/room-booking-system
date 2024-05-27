// src/components/RoomList.js
import React from 'react';
import { Link } from 'react-router-dom';

const rooms = [
  { id: 1, name: 'Room 1' },
  { id: 2, name: 'Room 2' },
  { id: 3, name: 'Room 3' },
];

const RoomList = () => {
  return (
    <div>
      <h2>Available Rooms:</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <Link to={`/timetable/${room.id}`}>{room.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

// export default RoomList;
// src/components/RoomList.js
// import React from 'react';
// import useRooms from 'Room';

// const RoomList = () => {
//   const { rooms, loading, error } = useRooms();

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   return (
//     <div>
//       <h1>Rooms</h1>
//       <ul>
//         {rooms.map(room => (
//           <li key={room.id}>{room.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default RoomList;
