import createPlayer from "../components/player";
import {rooms, createRoom, joinRoom, leaveRooms} from '../components/roomManager'
import { startGame, hit } from "../components/gameManager";

export default function roomHandlers(io, socket){
    socket.on('createRoom', (playerName) => {
        const roomId = createRoom()

        const player = createPlayer(socket.id, playerName)

        joinRoom(roomId, player)
        socket.join(roomId)

        socket.emit('roomCreated', roomId)
        io.to(roomId).emit('playerList', rooms[roomId].players)
    })

    socket.on('joinRoom', ({roomId, name}) => {
        if (!rooms[roomId]) {
            socket.emit('errorMessage', 'room not found')
            return
        }

        const player = createPlayer(socket.id, name)

        joinRoom(roomId, player)
        socket.join(roomId)

        io.to(roomId).emit('playerList', rooms[roomId].players)
    })

    socket.on("startGame", (roomId) => {
        const room = rooms[roomId]
        if (!room) return

        startGame(room)

        io.to(roomId).emit('gameStart', room)
    })

    socket.on('hit', (roomId) => {
        const room = rooms[roomId]
        if (!room) return

        hit(room, socket.id)

        io.to(roomId).emit('updateHands', room.players)
    })

    socket.on('disconnect', () => {
        leaveRooms(socket.id)
    })
}