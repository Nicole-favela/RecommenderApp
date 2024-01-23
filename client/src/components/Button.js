import React from 'react'
import { useState } from 'react'
import Box from '@mui/material/Box';
import { BASE_URL } from '../config/urls';
import './InputBox.css'
import Cookies from 'js-cookie'

function Button() {
   
    async function handleSubmit(e){
        e.preventDefault() 
       
  }
  
    return (
       

            
                <Box sx={{paddingBottom: 100, paddingLeft: 10}}>
                    <button className='glitch__btn' type= "submit">show movies list</button>
                </Box>
     
    )
}

export default Button