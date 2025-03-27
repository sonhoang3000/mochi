import { io } from 'socket.io-client';

const SOCKET_URL = 'http://10.0.2.2:8000';

let socket;
let isConnected = false;

export const connectSocket = (userId) => {
  if (!socket || !isConnected) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      query: { userId },
    });

    socket.on('connect', () => {
      console.log('✅ Connected to socket server:', socket.id);
      isConnected = true;
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      isConnected = false;
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnected = false;
  }
};

export const subscribeToNewMessages = (callback) => {
  if (!socket) return;
  socket.on('newMessage', callback);
};

export const unsubscribeFromMessages = () => {
  if (socket) {
    socket.off('newMessage');
  }
};

export const sendSocketMessage = (messageData) => {
  if (socket) {
    socket.emit('sendMessage', messageData);
  }
};

export default socket;
