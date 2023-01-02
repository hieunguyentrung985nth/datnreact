import React, { createContext, useContext, useEffect, useState } from 'react'
import AuthContext from './AuthProvider';
import { SocketContext } from './SocketProvider';

export const UsersOnlineContext = createContext({});

const UsersOnlineProvider = ({ children }) => {
  const { socket, totalUnseenMessages, setTotalUnseenMessages, myRooms, setMyRooms } = useContext(SocketContext);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [onlineUsersTemp, setOnlineUsersTemp] = useState(null);

  console.count('user render');

  useEffect(() => {
    socket.on("userOnline", (data) => {
      console.count('effect user');
      setOnlineUsers(data);
      setOnlineUsersTemp(data);
      console.log(data);
      return () => socket.off("userOnline");
    });
  }, [socket]);



  return (
    <UsersOnlineContext.Provider value={{ socket, onlineUsers, setOnlineUsers, onlineUsersTemp, setOnlineUsersTemp, myRooms, setMyRooms, totalUnseenMessages, setTotalUnseenMessages }}>
      {children}
    </UsersOnlineContext.Provider>
  )
}

export default UsersOnlineProvider