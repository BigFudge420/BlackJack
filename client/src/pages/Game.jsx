import { useEffect, useState } from "react";
import { socket } from "../sockets/socket";
import PlayerHand from "../components/PlayerHand";
import Controls from "../components/Controls";

export default function Game({roomId, playerName}) {
    const [players, setPlayers] = useState([])
    const [gameState, setGameState] = useState('waiting')

    useEffect(() => {
        socket.on('playerList', (list) => {
            setPlayers(list)
        })

        socket.on('gameStart', (room) => {
            setPlayers(room.players)
            setGameState('playing')
        })

        socket.on('updateHands', (updatedPlayers) => {
            setPlayers(updatedPlayers)
        })

        return () => {
            socket.off('playerList')
            socket.off('gameStart')
            socket.off('updateHands')
        }

    }, [])

    const startGame = () => {
        socket.emit('startGame', roomId)
    }

    return (
        <div>
            <h2>Room: {roomId}</h2>

            <h3>Players:</h3>
            {players.map((p) => (
                <PlayerHand key={p.id} player={p}/>
            ))}

            {gameState === 'waiting' && (
                <button onClick={startGame}>Start Game</button>
            )}

            {gameState === 'playing' && (
                <Controls roomId={roomId}/>
            )}
        </div>
    )
}