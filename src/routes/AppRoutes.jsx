import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ChatRooms from '../pages/Chatroom'; // หน้าแสดงห้องแชท
import Chat from '../pages/Chat'; // หน้าแชทแต่ละห้อง
import Login from '../pages/Login';
import Layout from '../components/Layout'; // โครงสร้าง Layout
import CreateRoom from '../pages/Createroom';
// import Profile from '../pages/Profile';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/chatroom" />}
      />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/chatroom" />} />
        
        <Route path="chatroom" element={user ? <ChatRooms /> : <Navigate to="/login" />} />
        
        <Route
          path="chat/:roomId"
          element={user ? <Chat /> : <Navigate to="/login" />}
          
        />
        <Route
          path="createroom"
          element={user ? <CreateRoom /> : <Navigate to="/login" />}
        /> 
        {/* <Route
          path="profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        /> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
