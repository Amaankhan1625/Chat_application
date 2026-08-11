import User from "../model/user.js";
import bcrypt from "bcrypt";
import {genrateToken} from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js";



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
export const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        const isPasswordcorrect  = await bcrypt.compare(password, user.password);

        if(!user || !isPasswordcorrect){
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user._id);

        res.json({ success:true , token, user: user ,message: "User logged in successfully" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false , message: "User not  logged in " });
    }

}

//controller to check if user is authorized or not
export const checkUser = async (req, res) => {
    res.json({ success:true , user: req.user ,message: "User is authorized" });
}


//controller to update user profile
export const updateProfile = async (req, res) => {
    try{
        const { username, email, bio } = req.body;

        const userId = await User.findById(req.user._id);
        let updateUser 

        if(!profilepic)
        {
            updateUser = await User.findByIdAndUpdate(userId, { username, email, bio }, { new: true });
        }
        else{
            const upload = await cloudinary.uploader.upload(profilepic) ;
            
            updateUser = await User.findByIdAndUpdate(userId, { username, email, bio, profilepic: upload.secure_url }, { new: true });
        }

        res.json({ success:true , user: updateUser ,message: "User profile updated successfully" });
        }
        catch(err)
        {
            res.json({success:false , message : err.message}) ;
        }
    }



