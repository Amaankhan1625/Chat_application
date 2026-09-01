

import jwt from "jsonwebtoken";
import User from "../model/user.js";

//Middleware to protect routes
export const protectRoute = async (req,res,next) => {

    try{
        const token = req.headers.token ;

        const decode = jwt.verify(token, process.env.JWT_SECRET) ;

        const user = await User.findById(decode.id).select("-password") ;
        
        if(!user){
            return res.status(401).json({message: "Not authorized, user not found"}) ;
        }

        req.user = user ;
        next() ;
    }catch(err){
        console.error(err.message) ;
        res.status(401).json({message: "Not authorized, token failed"}) ;
    }

}