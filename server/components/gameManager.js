import calcTotal from "./calcTotal.js";
import createDeck from "./createDeck.js";
import createPlayer from "./player.js";

export function startGame(room){
    room.dealer = createPlayer('dealer', 'Dealer')

    room.deck = createDeck()

    room.dealer.hand = [room.deck.pop(), room.deck.pop()]
    room.dealer.total = calcTotal(room.dealer.hand)

    room.players.forEach(p => {
        p.hand = [room.deck.pop(), room.deck.pop()]
        p.total = calcTotal(p.hand)

        if (p.total === 21) {
            p.blackjack = true
        }
    })

    room.gameState = 'playing'
    room.turn = 0

    return room
}


export function hit(room, playerId) {
    const player = room.players.find(p => p.id === playerId)
    const i = room.players.findIndex(p => p.id === playerId)

    if (!player) return

    player.hand.push(room.deck.pop())
    player.total = calcTotal(player.hand)

    let status = {blackjack: false, busted: false}

    if (player.total === 21) {
        player.blackjack = true
        status.blackjack = true
    }
    
    if (player.total > 21) {
        player.busted = true
        status.busted = true
    }
    
    console.log(player)

    if (status.blackjack || status.busted){
        
        if (i === room.players.length - 1) return {status, newCurrPlayer : null}
        const newCurrPlayer = room.players[i + 1]
        
        return {status, newCurrPlayer}
    }

    return {status, newCurrPlayer : player}
}

export function stand(room, playerId) {
    const i = room.players.findIndex(p => p.id === playerId)

    if (i === room.players.length - 1) return

    const newCurrPlayer = room.players[i+1]
    return newCurrPlayer
}
