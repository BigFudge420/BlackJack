import React from "react";
import { useState } from "react";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";

export default function App() {
  const [roomId, setRoomId] = useState(null)
  const [players, setPlayers] = useState([])

  return (
    <div style={{ width: '100%', height: '100%', margin: 0, padding: 0 }}>
        {!roomId ? (
          <Lobby setRoomId={setRoomId} setPlayers={setPlayers}/>
        ) : (
          <Game roomId={roomId} players={players} setRoomId={setRoomId} setPlayers={setPlayers}/>
        )}
    </div>
  )
}