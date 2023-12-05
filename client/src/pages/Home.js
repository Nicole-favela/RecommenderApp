import React from 'react'
import CircularLoader from '../components/CircularLoader'
import TextAnimation from '../components/TextAnimation'
import { useState } from 'react'
function Home() {
    const [isHoveredOver, setIsHoveredOver] = useState(false)
  return (
    <div className='home'>
       {isHoveredOver && <TextAnimation />}
       <div
        onMouseEnter={() => setIsHoveredOver(true)}
        onMouseLeave={() => setIsHoveredOver(false)}
     
       >
        <CircularLoader
          
        />
        </div>
    </div>
  )
}

export default Home