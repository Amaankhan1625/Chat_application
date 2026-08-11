import express from  "express" ;
import {protectRoute} from "../middleware/auth.js"
import { getMessages,getAllUsers,markMessageAsSeen,sendMessage } from "../controllers/messagecontroller.js";

const messageRouter = express.Router() ;

messageRouter.get("/users",protectRoute,getAllUsers) ;
messageRouter.get("/:id",protectRoute,getMessages) ;
messageRouter.get("mark/:id",protectRoute,markMessageAsSeen) ;
messageRouter.post("/send/:id",protectRoute,sendMessage) ;



export default messageRouter ;
