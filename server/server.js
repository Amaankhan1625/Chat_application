import express from "express";
import http from "http";
import "dotenv/config" ;
import cors from "cors";
import {connectDB} from "./lib/db.js"
import userRouter from "./routes/userRoute.js" ;
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

//create an express app and a http server
const app = express();
const server = http.createServer(app);

//initialise socket.io server
export const io = new Server(server,{
    cors:{origin:"*",}
})

//store online users
export const usersocketMap = {}; //{userId : socketId}

//socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log(`User connected: ${userId}`);

    if (userId) {
        usersocketMap[userId] = socket.id;
    }

    io.emit("onlineUsers", Object.keys(usersocketMap));

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${userId}`);
        if (userId) {
            delete usersocketMap[userId];
        }
        io.emit("onlineUsers", Object.keys(usersocketMap));
    });
});

//middleware
app.use(cors());
app.use(express.json({limit:"4mb"}));



//connect database
await connectDB() ;

//routes
app.use("/api/status", (req,res)=>res.send({status:"ok"}));
app.use("/api/user",userRouter);
app.use("/api/message",messageRouter)



const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
