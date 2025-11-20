export const rooms = {}

export function createRoom(){
    const id = Math.random().toString(36).substring(2,8)

    rooms[id] = {
        id,
        players: [],
        deck: [],
        gameState: "wating",
        turn: 0
    }

    return id
}

export function joinRoom(roomId, player){
    if (!rooms[roomId]) return false

    rooms[roomId].players.push(player)
    return rooms[roomId]
}

export function leaveRooms(socketId){
    Object.keys(rooms).forEach(roomId => {
        const room = rooms[roomId]
        room.players = room.players.filter(p => p.id !== socketId)

        if (room.players.length === 0) delete rooms[roomId]
    })
}