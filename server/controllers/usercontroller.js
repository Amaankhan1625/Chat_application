import User from "../models/user.js";
import bcrypt from "bcrypt";



//signup a new user 

export const signupUser = async (req, res) => {
        const { username, email, password, bio } = req.body;

        try{
            if(!username || !email || !password || !bio){
                return res.status(400).json({ message: "All fields are required" });
            }

            const user = await User.findOne({ email });

            if(user){
                return res.status(400).json({ message: "email already exists" });
            }

            const salt = await bcrypt.genSalt(10) ;
            const hashedPassword = await bcrypt.hash(password, salt)
            
            
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                bio,
            });

            await newUser.save();

           const token = generateToken(newUser._id);
            res.status(201).json({ success:true , token, user: newUser ,message: "User created successfully" });

        } catch (error) {
            console.log(error.meassage);
             res.json({ success: false , message: "User not  created " });
        } 
}

//controller to login a user 


