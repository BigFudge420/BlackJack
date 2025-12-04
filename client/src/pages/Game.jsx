import React from "react";
import { useEffect, useState } from "react";
import {  socket } from "../sockets/socket";
import PlayerHand from "../components/PlayerHand";
import DealerHand from "../components/DealerHand";
import Controls from "../components/Controls";
import "./styles/game.css";

export default function Game({roomId, players, setRoomId, setPlayers}) {
    const [gameState, setGameState] = useState('waiting')
    const [gameOver, setGameOver] = useState(false)
    const [currentPlayer, setCurrentPlayer] = useState(null)
    const [blackjack, setBlackjack] = useState(false)
    const [busted, setBusted] = useState(false)
    const [dealer, setDealer] = useState(null)


    useEffect(() => {
        socket.on('playerList', (list) => {
            setPlayers(list)
        })

        socket.on('gameStart', (room) => {
            setPlayers(room.players)
            setDealer(room.dealer)
            setGameOver(false)
            setGameState('playing')

            console.log(room.players)

            let player = room.players.find(p => p.id === socket.id) 
            if (player.blackjack){
                setBlackjack(true)
                socket.emit('stand', roomId)
            }
        })

        socket.on('updateHands', (updatedPlayers, updatedDealer) => {
            setPlayers(updatedPlayers)
            if (updatedDealer) setDealer(updatedDealer)
        })

        socket.on('updateCurrentPlayer', (currentPlayer) => {
            setCurrentPlayer(currentPlayer)
        })

        socket.on('blackjack', (bool) => {
            setBlackjack(bool)
            socket.emit('stand', roomId)
        })

        socket.on('busted', (bool) => {
            setBusted(bool)
            socket.emit('stand', roomId)
        })

        socket.on('gameOver', (bool) => {
            setGameOver(true)
            socket.emit('revealDealer', roomId)
        })

    }, [])

    function startGame () {
        socket.emit('startGame', roomId, (res) => {
            setPlayers(res)
        })
    }

    function restartGame () {
        setGameState('waiting')
        setBlackjack(false)
        setBusted(false)
        setCurrentPlayer(null)
        setGameOver(false)
        setDealer(null)

        let player = players.find(p => p.id === socket.id)
        player.blackjack = false
        player.busted = false
    }

    function leaveGame () {
        let socketId = socket.id
        socket.emit('leaveGame', {socketId, roomId})

        setRoomId(null);
        setPlayers([]);
        setBlackjack(false);
        setBusted(false);
        setGameOver(false);
        setCurrentPlayer(null);

    }

    return (
        <div className="game-container">
            <div className="game-header">
                <h1>◆ BLACKJACK ◆</h1>
                <div className="room-id">Room ID: {roomId}</div>
            </div>

            <div className={`game-content ${gameState === 'playing' ? 'playing' : ''}`}>
                <div className={`players-section ${gameState === 'playing' ? 'compact' : ''}`}>
                    <h2 className="section-title">Players</h2>
                    <div className="players-list">
                        {players.map((p) => (
                            <div key={p.id} className="player-item">
                                {p.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="game-area">
                    {!gameOver && gameState === 'waiting' && (
                        <div className="waiting-section">
                            <h2 className="section-title">Lobby</h2>
                            <button className="game-btn" onClick={startGame}>
                                ✚ START GAME
                            </button>
                        </div>
                    )}

                    {!gameOver && gameState === 'playing' && (
                        <div className="playing-section">                            
                            <div className="current-player">
                                ➤ Current Player: {currentPlayer?.name}
                            </div>
                            
                            <div className="players-list">
                                {dealer &&
                                <DealerHand dealer={dealer} gameOver={gameOver} />
                                }
                                <PlayerHand key={currentPlayer.id} player={currentPlayer}/>
                            </div>

                            {socket.id === currentPlayer?.id ? (
                                <div className="controls-section">
                                    <div className="status-message">Make your choice...</div>
                                    <Controls roomId={roomId} currentPlayer={currentPlayer} />
                                </div>
                            ) : (
                                <div className="status-message">
                                    {currentPlayer?.name} is making a choice. Please wait...
                                </div>
                            )}
                        </div>
                    )}

                    {gameOver && (
                        <div className="game-over-section">
                            {dealer && (
                                <div className="dealer-section">
                                    <h2 className="section-title">Dealer</h2>
                                    <div className="dealer-hand">
                                        <DealerHand dealer={dealer} gameOver={true} />
                                    </div>
                                </div>
                            )}
                            
                            <div className="game-over-content">
                                <h3>Game Over</h3>
                                <div className="action-buttons">
                                    <button className="game-btn" onClick={restartGame}>
                                        ↻ RESTART
                                    </button>
                                    <button className="game-btn danger" onClick={leaveGame}>
                                        ✕ DISCONNECT
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {blackjack && (
                <div className="status-badge blackjack">
                    ★ BLACKJACK! ★
                </div>
            )}
            {busted && (
                <div className="status-badge busted">
                    ✕ BUSTED ✕
                </div>
            )}
        </div>
    )
}