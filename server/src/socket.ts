import {Socket} from 'socket.io';

export const socketHandler = (socket: Socket) =>{
    console.log(`Người dùng kết nối: ${socket.id}`)

    socket.on('message', (message: string) => {
        console.log(`Nhận tin nhắn: ${message}`)
        socket.broadcast.emit('message', message);
    })

    socket.on('disconnect', () => {
        console.log(`Người dùng ngắt kết nối: ${socket.id}`)
    })
}