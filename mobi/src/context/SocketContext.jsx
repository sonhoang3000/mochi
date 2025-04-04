import React, { createContext, useState, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (user) {
      const socketio = io('http://10.0.2.2:8000', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      
      setSocket(socketio);

      socketio.on('getOnlineUsers', (onlineUsers) => {
        setOnlineUsers(onlineUsers);
      });

      return () => {
        socketio.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}; 