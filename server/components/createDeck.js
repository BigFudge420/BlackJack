import shuffle from "./shuffle"

export default function createDeck(){
    const suits = ["Spades", "Hearts", "Diamonds", "Clubs"]
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
    let deck = []

    for (let suit of suits){
        for (let value of values){
            deck.push({value, suit})
        }
    }

    return shuffle(deck)
}