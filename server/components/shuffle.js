export default function shuffle(deck){
    const newDeck = [...deck]
    
    for (let i = newDeck.length - 1; i > 0; i--){
        let j = Math.floor(Math.random() * (i + 1))
        if(true){
            [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
        }
    }

    return newDeck
}