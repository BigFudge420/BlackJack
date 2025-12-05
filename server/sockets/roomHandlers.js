import createPlayer from "../components/player.js";
import {rooms, createRoom, joinRoom, leaveRooms} from '../components/roomManager.js'
import { startGame, hit, stand} from "../components/gameManager.js";
import calcTotal from "../components/calcTotal.js";

export default function roomHandlers(io, socket){
    console.log("ROOM HANDLERS LOADED", Date.now());

    socket.on('createRoom', (playerName, ack) => {
        const roomId = createRoom()
        const player = createPlayer(socket.id, playerName)

        joinRoom(roomId, player)
        socket.join(roomId)
        console.log('[server] socket', socket.id, 'joined room', roomId)


        socket.emit('roomCreated', roomId)

        if (ack) ack(rooms[roomId].players)
        socket.emit('playerList', rooms[roomId].players)
        io.to(roomId).emit('playerList', rooms[roomId].players)
    })

    socket.on('joinRoom', ({roomId, name}, ack) => {
        if (!rooms[roomId]) {
            socket.emit('errorMessage', 'room not found')
            return
        }

        const player = createPlayer(socket.id, name)

        joinRoom(roomId, player)
        socket.join(roomId)

        if (ack) ack(rooms[roomId].players)
        socket.emit('playerList', rooms[roomId].players)
        io.to(roomId).emit('playerList', rooms[roomId].players)
    })

    socket.on("startGame", (roomId, ack) => {
        const room = rooms[roomId]
        if (!room) return

        startGame(room)

        if (ack) ack(room.players)
        console.log(room.players)

        io.to(roomId).emit('updateCurrentPlayer', room.players[0])
        io.to(roomId).emit('updateHands', room.players, room.dealer)
        io.to(roomId).emit('gameStart', room)
    })

    socket.on('hit', (roomId) => {
        const room = rooms[roomId]
        if (!room) return

        let res = hit(room, socket.id)

        if (res.status.blackjack) {
            socket.emit('blackjack', true)
        }

        if (res.status.busted) {
            socket.emit('busted', true)
        }

        if (!res.newCurrPlayer){
            console.log('ending')
            io.to(roomId).emit('gameOver', true)
        }

        io.to(roomId).emit('updateHands', room.players, room.dealer)
        io.to(roomId).emit('updateCurrentPlayer', res.newCurrPlayer)
    })

    socket.on('stand', (roomId) => {
        const room = rooms[roomId]
        if (!room) return
        
        const currPlayer = stand(room, socket.id)

        if (!currPlayer) {
            io.to(roomId).emit('gameOver', true)
        }

        io.to(roomId).emit('updateCurrentPlayer', currPlayer)
    })

    socket.on('revealDealer', (roomId) => {
        const room = rooms[roomId]
        if (!room) return
        
        const dealer = room.dealer
        const deck = room.deck 
                
        if (dealer.total >= 17) {
            
            if (dealer.total === 21) {
                dealer.blackjack = true
            }

            console.log('Already 17 or above: ', dealer.hand)

            return
        }

        while (true) {
            dealer.hand.push(deck.pop())
            dealer.total = calcTotal(dealer.hand)

            console.log('Hitting: ', dealer.hand)

            if (dealer.total === 21) {
                dealer.blackjack = true
                break
            }

            if (dealer.total > 21) {
                dealer.busted = true
                break
            }

            if (dealer.total >= 17) {
                break
            }
        }

        io.to(roomId).emit('updateHands', room.players, room.dealer)
    })

    socket.on('leaveGame', ({socketId, roomId}) => {
        leaveRooms(socketId)

        const room = rooms[roomId]
        const list = room ? room.players : []

        io.to(roomId).emit('playerList', list)
    })

    socket.on('disconnect', (reason) => {
        console.warn('Socket disconnected: ', reason)
        if (reason === 'io server disconnect'){
            socket.connect()
        }
    })
}