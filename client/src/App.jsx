import React from 'react'
import { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Homepage from './pages/Homepage'
import Loginpage from './pages/Loginpage'
import Profilepage from './pages/Profilepage'
import {Toaster} from 'react-hot-toast'
import {AuthContext} from '../context/Authcontext.jsx'
const App = () => { 
  const {authUser, isAuthChecked} = useContext(AuthContext) ;

  if(!isAuthChecked){
    return null;
  }

  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Toaster/>
      <Routes>
        <Route path="/" element={authUser? <Homepage/>:<Navigate to="/Login" />} />
        <Route path="/Login" element={!authUser?<Loginpage/>:<Navigate to="/" />} />
        <Route path="/profile" element={authUser?<Profilepage/>:<Navigate to="/Login" />} />
      </Routes>
    </div>
  )
}

export default App;
