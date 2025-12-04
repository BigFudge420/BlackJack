import React from "react";
import { useState } from "react";
import { ensureConnected, socket } from "../sockets/socket";
import "./styles/lobby.css";

export default function Lobby({ setRoomId, setPlayers }) {
    const [name, setName] = useState("");
    const [joinId, setJoinId] = useState("");
    const [creating, setCreating] = useState(false);
    const [joining, setJoining] = useState(false);

    async function createRoom() {
        if (!name) return;
        setCreating(true);
        await ensureConnected();
        socket.emit("createRoom", name, (res) => setPlayers(res));
        socket.once("roomCreated", (id) => {
            setRoomId(id);
            setCreating(false);
        });
    }

    async function joinRoom() {
        if (!name || !joinId) return;
        setJoining(true);
        await ensureConnected();
        socket.emit("joinRoom", { roomId: joinId, name }, (res) => setPlayers(res));
        socket.once("errorMessage", (msg) => {
            alert(msg);
            setJoining(false);
        });
        socket.once("playerList", () => {
            setRoomId(joinId);
            setJoining(false);
        });
    }

    return (
        <div className="lobby-container">
            <div className="lobby-content">
                <div className="lobby-top">
                    <h1 className="lobby-title">◆ BLACKJACK ◆</h1>
                    <div className="lobby-sub">▸ Never stop busting ◂</div>
                </div>

                <div className="lobby-form">
                    <div className="lobby-name">
                        <label className="form-label">PLAYER NAME</label>
                        <input
                            className="lobby-input"
                            placeholder="YOUR NAME"
                            value={name}
                            onChange={(e) => setName(e.target.value.toUpperCase())}
                            maxLength={16}
                        />
                    </div>

                    <button
                        className="lobby-btn primary-btn"
                        onClick={createRoom}
                        disabled={!name || creating}
                    >
                        {creating ? '◇ CREATING ◇' : '✚ CREATE ROOM'}
                    </button>

                    <div className="divider">OR</div>

                    <div className="lobby-join">
                        <label className="form-label">ROOM ID</label>
                        <div className="join-controls">
                            <input
                                className="lobby-input"
                                placeholder="ROOM ID"
                                value={joinId}
                                onChange={(e) => setJoinId(e.target.value)}
                            />
                            <button
                                className="lobby-btn secondary-btn"
                                onClick={joinRoom}
                                disabled={!name || !joinId || joining}
                            >
                                {joining ? '⟳ JOINING' : '→ JOIN'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="lobby-footer">▸ Join or create a room to gamble away your lifesavings. ◂</div>
        </div>
    );
}