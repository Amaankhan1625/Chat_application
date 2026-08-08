import express from "express";
import http from "http";
import "dotenv/config" ;
import cors from "cors";
import {connectDB} from "./lib/db.js"

//create an express app and a http server
const app = express();
const server = http.createServer(app);

//middleware
app.use(cors());
app.use(express.json({limit:"4mb"}));

//connect database
await connectDB() ;

//routes
app.use("/api/status", (req,res)=>res.send({status:"ok"}));


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
