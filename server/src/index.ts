import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

io.on('connection',  (socket: Socket) =>{
    socket.on('joinRoom', (room: string) => {
        socket.join(room);
        console.log(`${socket.id} đã tham gia phòng: ${room}`);
        socket.to(room).emit('message', `Người dùng ${socket.id} đã tham gia phòng`)
    })

    socket.on('leaveRoom', (room: string) => {
        socket.leave(room);
        console.log(`${socket.id} đã rời phòng: ${room}`);
        socket.to(room).emit('message', `Người dùng ${socket.id} đã rời phòng`)
    })

    socket.on('message', (room: string, message: string) => {
        console.log(`Tin nhắn từ phòng ${room}: ${message}`);
        io.to(room).emit('message', `${socket.id}: ${message}`)
    })

    socket.on('disconnect', () =>{
        console.log(`Người dùng ngắt kết nối: ${socket.id}` )
    })
});

const PORT = 3001;

server.listen(PORT, ()=>{
    console.log(`Server đang chạy trên cổng ${PORT}`)
})