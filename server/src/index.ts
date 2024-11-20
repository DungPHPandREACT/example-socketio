import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { Server, Socket } from 'socket.io';
import { createProduct, deleteProduct, getProducts, updateProduct } from './controllers/product.controller';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

app.use(express.json());

try{
    mongoose.connect("mongodb://localhost:27017/realtime-crud")
    mongoose.connection.on("connected", () => {
        console.log('Kết nối MongoDB thành công')
    })
} catch(error){
    mongoose.connection.on("error", (error) => {
        console.log('Lỗi kết nối MongoDB: ', error)
    })
}

io.on("connection", (socket) => {
    console.log('Client kết nối: ', socket.id);

    socket.on("create_product", async (data) => {
        try{
            const product = await createProduct(data);
            io.emit('product_created', product);
        } catch(error){
            console.log('Lỗi khi tạo sản phẩm: ', error)
        }
    })

    socket.on('get_products', async () => {
        try{
            const products = await getProducts();
            socket.emit('products_list', products);
        } catch(error){
            console.log('Lỗi khi lấy danh sách sản phẩm: ', error)
        }
    })

    socket.on('update_product', async ({id, data}) => {
        try{
            const product = await updateProduct(id, data);
            io.emit('product_updated', product);
        } catch(error){
            console.log("Lỗi khi cập nhật sản phẩm: ", error)
        }
    })

    socket.on("delete_product", async (id) => {
        try{
            await deleteProduct(id);
            io.emit('product_deleted', id);
        } catch(error){
            console.log("Lỗi khi xóa sản phẩm: ", error)
        }
    })

    socket.on("disconnect", ()=>{
        console.log("Client ngắt kết nối: ", socket.id)
    })
})


const PORT = 3001;

server.listen(PORT, ()=>{
    console.log(`Server đang chạy trên cổng ${PORT}`)
})