import {io} from 'socket.io-client'

const URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

export const socket = io(URL, {
    transports: ['websocket'], 
    withCredentials: true,
    autoConnect: true
})

socket.on('connect', () => {
    console.log('socket connected:', socket.id)
})

socket.on('connect_error', (err) => {
    console.error('socket connect_error:', err.message)
})