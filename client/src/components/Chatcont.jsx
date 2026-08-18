import React, { useEffect, useRef } from 'react'
import assets, { messagesDummyData } from '../assets/assets.js'
import { formatMessageTime } from '../lib/utils.js';

const Chatcont = ({selectedUser , setSelectedUser}) => {

const scrollEnd = useRef() ;
useEffect(()=>{
  if(scrollEnd.current)
  {
    scrollEnd.current.scrollIntoView({
      behavior: 'smooth'
    })
  }
},[])

  return selectedUser ?  (
    <div className = 'h-full overflow-scroll relative blackdrop-blur-lg'>
      {/*----------------HEADER------------------*/}
      <div className = "flex items-centre gap-3 py-4 px-5 border-b border-stone-600"> 
             <img src = {assets.profile_martin} alt = "profile" className = "w-8 rounded-full"/>
             
                <p className = "flex-1 text-lg text-white flex item-centre gap-2">
                  Martin Johnson
                  <span className = "text-green-400 rounded-full w-2 h-2">Online</span>
                </p>
                <img onClick={()=> setSelectedUser(null)} src = {assets.arrow_icon} alt = "arrow" className = "md:hidden max-w-7"/>
                <img src = {assets.help_icon} alt = "help" className = "max-md:hidden max-w-5"/>
      </div>




      {/* ----------------chat area----------------- */}
   <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
    {messagesDummyData.map((msg, index) => (
        <div
            key={index} className={`flex items-end gap-2 justify-end ${ msg.senderId !== "680f50e4f10f3cd28382ecf9" && "flex-row-reverse" }`}>
            {msg.image ? (
               <img src={msg.image} alt="" className="max-w-57.5 border border-gray-700 rounded-lg overflow-hidden mb-8"/>
            ) : (
                <p className={`p-2 max-w-50 md: text-sm font-light rounded-1g mb-8 break-all bg-violet-500/30 text-white ${msg. senderId === '680f50e4f10f3cd28382ecf9' ? 'rounded-br-none' : 'rounded-bl-none'}` }>{msg.text}</p>
            )}

            <div className="text-center text-xs"> <img src={msg.senderId === '680f50e4f10f3cd28382ecf9' ? assets. avatar_icon : assets.profile_martin} alt="" className='w-7 rounded-full' /> 
            <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p> 
            </div>

        </div>
    ))}

    <div ref = {scrollEnd} >  </div>



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
