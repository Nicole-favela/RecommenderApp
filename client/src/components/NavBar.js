import React from 'react'
import { useState, useEffect } from 'react'
import './NavBar.css'
import LogoutButton from './LogoutButton'


function NavBar() {
    const [show, handleShow] = useState(false)
    
    // const transitionNavBar = ()=>{
    //   //makes top navbar disappear when user scrolls down
    //   if (window.scrollY> 100){
    //     handleShow(true)
  
    //   }
    //   else{
    //     handleShow(false)
    //   }
    // }
    // useEffect(()=>{
    //     window.addEventListener("scroll", transitionNavBar) 
       
    //     return ()=> window.removeEventListener("scroll", transitionNavBar)
    
    //   },[])
  return (
    <div className={`navbar `}>
      <div className='navbar__contents'>
          <h2>Recommender</h2>
          {/* <img className="navbar__logo"src={project_name} alt="logo" /> */}
         
         {/* <img className="nav__avatar" src={user_icon} alt="user-avatar" /> */}
         <div className='logout'>
            <LogoutButton/>

         </div>
         



      </div>
    
    </div>
  )
}

export default NavBar