import { io, Socket } from 'socket.io-client'
import API_BASE_URL from './services/api'

const socket: Socket = io(API_BASE_URL, {
  transports: ['websocket'],
  path: '/socket.io',
  reconnection: true,
  reconnectionAttempts: 5,
})

socket.on('connect', () => {
  console.info('Socket connected:', socket.id)
})

socket.on('disconnect', () => {
  console.warn('Socket disconnected')
})

export default socket
