import createDeck from "./createDeck";

export function startGame(room){
    room.deck = createDeck()

    room.players.forEach(p => {
        p.hand = [room.deck.pop(), room.deck.pop()]
    })

    room.gameState = 'playing'
    room.turn = 0

    return room
}

export function hit(room, playerId) {
    const player = room.players.find(p => p.id === playerId)
    if (!player) return

    player.hand.push(room.deck.pop())
}
