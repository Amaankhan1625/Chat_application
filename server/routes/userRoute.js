import express from "express";
import {checkUser,loginUser,signupUser,updateProfile} from "../controllers/userController.js";
import {protectRoute} from "../middleware/auth.js" ;

const userRouter = express.Router();

userRouter.post("/signup", signupUser);
userRouter.post("/login", loginUser );
userRouter.get("/check", protectRoute, checkUser);
userRouter.put("/update-profile", protectRoute, updateProfile);

export default userRouter;