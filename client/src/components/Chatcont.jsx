import React, { useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import assets, { messagesDummyData } from '../assets/assets.js'
import { formatMessageTime } from '../lib/utils.js';
import{ChatContext} from '../../context/ChatContext.jsx'
import {AuthContext} from '../../context/Authcontext.jsx'

const Chatcont = () => {

  const { messages,selectedUser,setSelectedUser,getMessages,sendMessage,} = useContext(ChatContext) ;
  const {authUser,onlineUsers } = useContext(AuthContext) ;

  const [input , setInput] = useState("") ;

  const handlesendMessage = async (e) => {
    e.preventDefault() ;
    if(input.trim() ==="") return ;

    await sendMessage({text: input.trim()}) ;
    setInput("") ; 
  }

  //handle sending image
  const handleSendImage= async (e) =>{ 
    const file = e. target. files[0]; 
    
    if(!file || ! file. type. startsWith("image/")){ 
      toast.error("select an image file") 
      return;
    }  
      const reader = new FileReader();  
      reader.onloadend = async ()=>{
      await sendMessage({image: reader.result})
       e.target.value = ""  
      }
       reader. readAsDataURL(file)  

}

const scrollEnd = useRef() ;

useEffect(()=>{
  if(selectedUser){
    getMessages(selectedUser._id) ;
  }
},[selectedUser]) ;


useEffect(()=>{
  if(scrollEnd.current)
  {
    scrollEnd.current.scrollIntoView({
      behavior: 'smooth'
    })
  }
},[messages]) ;

  return selectedUser ?  (
    <div className = 'h-full overflow-scroll relative blackdrop-blur-lg'>
      {/*----------------HEADER------------------*/}
      <div className = "flex items-centre gap-3 py-4 px-5 border-b border-stone-600"> 
             <img src = {selectedUser.profilepic || assets.avatar_icon} alt = "profile" className = "w-8 rounded-full"/>
             
                <p className = "flex-1 text-lg text-white flex item-centre gap-2">
                  {selectedUser.username}
                  {onlineUsers.includes(selectedUser._id) && <span className = "text-green-400 rounded-full w-2 h-2">Online</span>}
                </p>
                <img onClick={()=> setSelectedUser(null)} src = {assets.arrow_icon} alt = "arrow" className = "md:hidden max-w-7"/>
                <img src = {assets.help_icon} alt = "help" className = "max-md:hidden max-w-5"/>
      </div>




      {/* ----------------chat area----------------- */}
   <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
    {messages.map((msg, index) => (
        <div
            key={index} className={`flex items-end gap-2 justify-end ${ msg.senderId !== authUser._id && "flex-row-reverse" }`}>
            {msg.image ? (
               <img src={msg.image} alt="" className="max-w-57.5 border border-gray-700 rounded-lg overflow-hidden mb-8"/>
            ) : (
                <p className={`p-2 max-w-50 md: text-sm font-light rounded-1g mb-8 break-all bg-violet-500/30 text-white ${msg. senderId ===  authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}` }>{msg.text}</p>
            )}

            <div className="text-center text-xs"> <img src={msg.senderId ===  authUser._id ? authUser?.profilepic || assets.avatar_icon : selectedUser?.profilepic || assets.avatar_icon} alt="" className='w-7 rounded-full' /> 
            <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p> 
            </div>

        </div>
    ))}

    <div ref = {scrollEnd} >  </div>
</div>
{/*<---------------------bottom area ----------->*/}
<div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'> 
  <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
   <input onChange={(e)=>setInput(e.target.value)} value = {input} onKeyDown={(e)=>e.key === "Enter" ? handlesendMessage(e):null} type="text" placeholder="Send a message" className='flex-1 text-sm p-3 border-none rounded-1g outline-none text-white placeholder-gray-400'/> 
    <input onChange= {handleSendImage}  type="file" id='image' accept='image/png, image/jpeg' hidden/> 
     <label htmlFor="image"> <img src={assets. gallery_icon} alt="" className="w-5 mr-2 cursor-pointer"/> 
     </label> 
  </div> 
    <img onClick = {handlesendMessage} src={assets. send_button} alt="" className="w-7 cursor-pointer" /> 
  </div>  
      
    </div>  
  ) : (
    <div className = 'flex flex-col justify-center items-center h-full gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src = {assets.logo.icon} className='max-w-16' alt="" />
      <p className = 'text-white font-medium text-lg'>CHAT HERE</p>
    </div>
  )
}

export default Chatcont
