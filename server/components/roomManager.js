export const rooms = {}

export function createRoom(){
    const id = Math.random().toString(36).substring(2,8)

    rooms[id] = {
        id,
        dealer: {},
        players: [],
        deck: [],
        gameState: "waiting",
        turn: 0
    }

    console.log('THE ROOMs,', rooms)
    return id
}

export function joinRoom(roomId, player){
    if (!rooms[roomId]) {
        console.log('room not found')
    }

    rooms[roomId].players.push(player)
    console.log(rooms[roomId].players)

    console.log('THE ROOMs,', rooms)

    return rooms[roomId]
}

export function leaveRooms(socketId){
    const changedRooms = []

    Object.keys(rooms).forEach(roomId => {
        const room = rooms[roomId]
        const before = room.players.length
        room.players = room.players.filter(p => p.id !== socketId)

        if (room.players.length === 0) {
            delete rooms[roomId]
            changedRooms.push(roomId)
        } else if (room.players.length < before) {
            changedRooms.push(roomId)
        }
    })
    
    return changedRooms
}
