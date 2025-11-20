export default function createPlayer(id, name){
    return {
        id, 
        name,
        hand: [],
        chips: 2500,
        bet: 0,
        status: 'playing'
    }
}