import React from "react";
import "./styles/cards.css";


export default function PlayerHand({player}){
    console.log(player.hand)

    const hand = Array.isArray(player?.hand) ? player.hand : []

    const calculateHandValue = (cards) => {
        let total = 0;
        let aces = 0;
        
        cards.forEach(card => {
            if (card.value === 'A') {
                aces += 1;
                total += 11;
            } else if (['K', 'Q', 'J'].includes(card.value)) {
                total += 10;
            } else {
                total += parseInt(card.value);
            }
        });
        
        while (total > 21 && aces > 0) {
            total -= 10;
            aces -= 1;
        }
        
        return total;
    };

    const getSuitSymbol = (suit) => {
        const symbols = {
            'hearts': '♥',
            'diamonds': '♦',
            'clubs': '♣',
            'spades': '♠'
        };
        return symbols[suit?.toLowerCase()] || suit;
    };

    const handValue = hand.length > 0 ? calculateHandValue(hand) : 0;

    return (
        <div className="player-hand-container">
            <div className="player-name">{player?.name ? player.name : 'Unknown'}</div>
            <div className="cards-container">
                {hand.length === 0 ? (
                    <span className="no-cards-message">Waiting for cards...</span>
                ) : (
                    hand.map((card, i) => (
                        <div key={i} className="card">
                            <div className="card-corner-top">
                                <span>{card.value}</span>
                                <span className="suit-symbol">{getSuitSymbol(card.suit)}</span>
                            </div>
                            <div className="card-value">{card.value}</div>
                            <div className="card-suit">{getSuitSymbol(card.suit)}</div>
                            <div className="card-corner-bottom">
                                <span>{card.value}</span>
                                <span className="suit-symbol">{getSuitSymbol(card.suit)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {hand.length > 0 && <div className="hand-value">Total: {handValue}</div>}
        </div>
    )
}