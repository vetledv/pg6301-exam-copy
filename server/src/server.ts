import dotenv from 'dotenv'
import express from 'express'
import { AddressInfo } from 'net'
import path from 'path'
import { WebSocket, WebSocketServer } from 'ws'
import { app, mongoClient } from './app'
import { ArticleRouter } from './ArticleRouter'

dotenv.config()

const db = mongoClient.db(process.env.MONGODB_NAME)

const ws = new WebSocketServer({ noServer: true })
const sockets: WebSocket[] = []

ws.on('connect', (socket) => {
    sockets.push(socket)
    socket.on('message', (data: any) => {
        for (const recipient of sockets) {
            recipient.send(data)
        }
    })
})
//
mongoClient.connect().then(async () => {
    console.log('Connected to MongoDB')
})

app.use('/api/articles', ArticleRouter(db))
app.use(express.static('../client/dist'))
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        res.sendFile(path.resolve('../client/dist/index.html'))
    } else {
        next()
    }
})

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`http://localhost:${(server.address() as AddressInfo).port}`)
    server.on('upgrade', (req, socket, head) => {
        ws.handleUpgrade(req, socket, head, (socket) => {
            ws.emit('connect', socket, req)
        })
    })
})
