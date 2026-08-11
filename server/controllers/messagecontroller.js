import User from '../model/user.js';
import Message from '../model/message.js';
import cloudinary from '../lib/cloudinary.js';
import { usersocketMap, io } from '../server.js';


//get all user except the current user
export const getAllUsers = async (req, res) => {
    try {
        const user = req.user._id ;
        const filteredUsers = await User.find({ _id: { $ne: req.params.id } }).select('-password');

        //count number of messages not seen by the current user
        const unseenMessages = {} ;
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.countDocuments({ senderId: user._id, receiverId: req.params.id, seen: false });
            if(messages.length > 0)
            {
                unseenmessages[user._id] = messages.length ;
            }
        });

        await Promise.all(promises);
        res.json({success:true , users: filteredUsers, unseenMessages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get all messages for selected users
export const getMessages = async (req, res) => {
    try{
       const {id : selectedUserId} = req.params;
       const myId = req.user._id ;
       
       const messages = await Message.find({
        $or : [
            {senderId : myId , receiverId : selectedUserId},
            {senderId : selectedUserId , receiverId : myId}
        ]
       })
       await Message.updateMany({senderId : selectedUserId , receiverId : myId , seen : false} , {seen : true}) ;
    res.json({success:true , messages})
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

//api to mark message as seen using message id 
export const markMessageAsSeen = async(req,res)=>{
    try{
     const {id} = req.params ;
     await Message.findbyIdandupdate(id,{seen:true})
     res.json({success:true}) 
     
    }catch(error){
res.json({success:false , message : error.message})
    }
}

//send message to selected user
export const sendMessage = async (req, res) => {
    try{
       const {text,image} = req.body ;
       const receiverId = req.params.id ;
       const senderId = req.user._id ;
      
       let imageurl ;

       if(image){
        const uploadResponse = await cloudinary.uploader.upload(image)
        imageurl = uploadResponse.secure_url ;
       }
       const message = await Message.create({senderId , receiverId , text , image:imageurl}) ;

       //emit message to receiver if online
         const receiverSocketId = usersocketMap[receiverId] ;
         if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",message) ;
         }

       res.json({success:true , message})
    }catch(error){
        res.json({success:false , message : error.message})
    }
}

//