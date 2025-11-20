import { useState } from "react";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";

export default function App() {
  const [roomId, setRoomId] = useState(null)
  const [playerName, setPlayerName] = useState('')

  return (
    <>
      {!roomId ? (
        <Lobby setRoomId={setRoomId} setPlayerName={setPlayerName}/>
      ) : (
        <Game roomId={roomId} playerName={playerName}/>
      )}
    </>
  )
}