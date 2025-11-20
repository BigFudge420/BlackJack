import express from  "express"
import http from "http"
import {Server as IOServer} from "socket.io"

const app = express()
const httpServer = http.createServer(app)

const io = new IOServer(httpServer, {
    cors: {
        origin: true,
        methods: ['GET', 'POST'],
        credentials: true
    }
})

io.on('connection', (socket) => {
    console.log('player joined: ', socket.id)
})

app.get('/health', (_req, res) => res.send('ok'))

const PORT = process.env.PORT || 3000

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server live on http://localhost:${PORT}`)
})