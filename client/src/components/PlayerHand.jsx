export default function PlayerHand({player}){
    return (
        <div>
            <strong>{player.name}</strong>
            <div>
                {player.hand.map((card, i) => {
                    <span key={i}>
                        {card.value} {card.suit}
                    </span>
                })}
            </div>
        </div>
    )
}