import React from "react";
import { socket } from "../sockets/socket";
import "./styles/control.css";

export default function Controls({roomId, currentPlayer}) {
    const hit = () => {
        socket.emit('hit', roomId)
    }

    const stand = () => {
        socket.emit('stand', roomId)
    }

    return (
        <div className="controls-container">
            <button className="control-btn" onClick={hit}>
                ✚ Hit
            </button>
            <button className="control-btn stand" onClick={stand}>
                ⊡ Stand
            </button>
        </div>
    )
}