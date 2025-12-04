export default function createPlayer(id, name){
    return {
        id, 
        name,
        hand: [],
        total: 0,
        chips: 2500,
        bet: 0,
        busted: false,
        blackjack: false, 
        status: 'playing'
    }
}