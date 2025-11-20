import { useState } from "react";
import { socket } from "../sockets/socket";
import { div } from "framer-motion/client";

export default function Lobby({setRoomId, setPlayerName}) {
    const [name, setName] = useState('')
    const [joinId, setJoinId] = useState('')

    const createRoom = () => {
        setPlayerName(name)

        socket.emit('createRoom', name)

        socket.once('roomCreated', (id) => {
            setRoomId(id)
        })
    }


    const joinRoom = () => {
        setPlayerName(name)

        socket.emit('joinRoom', {roomId: joinId, name})

        socket.once('errorMessage', (msg) => alert(msg))

        socket.once('playerList', () => {
            setRoomId(joinId)
        })
    }

    return (
        <div>
            <h1>BlackJack</h1>

            <input 
            placeholder="Your name"
            name={name}
            onChange={(e) => setName(e.target.value)}
             />
             <button onClick={createRoom}>Create Room</button>
             
             <br />
             
             <input 
             placeholder="Room Id"
             value={joinId}
             onChange={(e) => setJoinId(e.target.value)} 
             />
             <button onClick={joinRoom}>Join Room</button>
        </div>
    )

}