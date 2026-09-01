import express from "express";
import {checkUser,loginUser,signupUser,updateProfile,getallUsers} from  '../controllers/usercontroller.js' ;
import {protectRoute} from "../middleware/auth.js" ;

const userRouter = express.Router();

userRouter.get("/getallusers", protectRoute, getallUsers);
userRouter.post("/signup", signupUser);
userRouter.post("/login", loginUser );
userRouter.get("/check", protectRoute, checkUser);
userRouter.put("/update-profile", protectRoute, updateProfile);

export default userRouter;