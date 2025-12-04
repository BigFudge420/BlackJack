import express from  "express"
import http from "http"
import {Server as IOServer} from "socket.io"
import roomHandlers from './sockets/roomHandlers.js'

const app = express()
const httpServer = http.createServer(app)

const io = new IOServer(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
})

io.on('connection', (socket) => {
    console.log('player joined: ', socket.id)
    
    roomHandlers(io, socket)
})


app.get('/health', (_req, res) => res.send('ok'))

const PORT = process.env.PORT || 3000

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server live on http://localhost:${PORT}`)
})