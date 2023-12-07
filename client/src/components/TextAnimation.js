import React from 'react'
import './TextAnimation.css'
const TextAnimation = () => {
  const displayText = "Welcome, enter a movie title to begin"
  return (
    <div className='typing__effect'>
      {displayText.split('').map((char, i)=>{
        <span key={i} style= {{animationDelay: `${i * .8}s`}}>
            {char}
        </span>
      })}
     
    </div>
  )
}

export default TextAnimation