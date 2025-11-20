import { socket } from "../sockets/socket";

export default function Controls({roomId}) {
    const hit = () => {
        socket.emit('hit', roomId)
    }

    const stand = () => {
        alert('Not implemented yet')
    }

    return (
        <div>
            <button onClick={hit}>Hit</button>
            <button onClick={stand}>Stand</button>
        </div>
    )
}