import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { socketHandler } from './socket';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

io.on('connection', socketHandler);

const PORT = 3001;

server.listen(PORT, ()=>{
    console.log(`Server đang chạy trên cổng ${PORT}`)
})