import { io } from 'socket.io-client';
console.log('🌍 Connecting to socket server:', import.meta.env.VITE_BACKEND_URL);
const socket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ['websocket'],
    path: '/socket.io',
    reconnection: true,
    reconnectionAttempts: 5,
});
socket.on('connect', () => {
    console.log('🟢 Connected to socket.io server with ID:', socket.id);
});
socket.on('disconnect', () => {
    console.warn('🔴 Disconnected from socket.io server');
});
socket.onAny((event, ...args) => {
    console.log('🛰️ Received socket event:', event, args);
});
export default socket;
