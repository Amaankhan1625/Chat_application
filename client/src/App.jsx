import React from 'react'
import {Route,Routes} from 'react-router-dom' 
import Homepage from './pages/Homepage'
import Loginpage from './pages/Loginpage'
import Profilepage from './pages/Profilepage'

const App = () => { 
  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Login" element={<Loginpage />} />
        <Route path="/profile" element={<Profilepage />} />
      </Routes>
    </div>
  )
}

export default App
