import React from 'react'
import assets from '../assets/assets.js'

const Chatcont = ({selectedUser , setSelectedUser}) => {
  return selectedUser ?  (
    <div className = 'h-full overflow-scroll relative blackdrop-blur-lg'>
      <div className = "flex items-centre gap-3 py-4 px-5 border-b border-stone-600"> 
             <img src = {assets.profile_martin} alt = "profile" className = "w-8 rounded-full"/>
             
                <p className = "flex-1 text-lg text-white flex item-centre gap-2">
                  Martin Johnson
                  <span className = "text-green-400 rounded-full w-2 h-2">Online</span>
                </p>
                <img onClick={()=> setSelectedUser(null)} src = {assets.arrow_icon} alt = "arrow" className = "md:hidden max-w-7"/>
                <img src = {assets.help_icon} alt = "help" className = "max-md:hidden max-w-5"/>
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
