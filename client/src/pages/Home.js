import React from 'react'
import CircularLoader from '../components/CircularLoader'
import TextAnimation from '../components/TextAnimation'
import { useState } from 'react'
import NavBar from '../components/NavBar'

import InputBox from '../components/InputBox'
import './Home.css'
function Home() {
    const [isHoveredOver, setIsHoveredOver] = useState(false)
    const [open, setOpen] = useState(false)
    const showInputBox = ()=> setOpen(true)
  return (
    <div className='home'>
        <NavBar/>
       {isHoveredOver && <TextAnimation />}
       <div
        onMouseEnter={() => setIsHoveredOver(true)}
        onMouseLeave={() => setIsHoveredOver(false)}
     
       >
        <CircularLoader
          onClick={()=>showInputBox()}
        />
        {isHoveredOver && <InputBox/>}
        </div>
    </div>
  )
}

export default Home