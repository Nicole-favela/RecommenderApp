import React from 'react'
import { useState } from 'react'
import Box from '@mui/material/Box';
import { BASE_URL } from '../config/urls';
import './InputBox.css'

function InputBox() {
   
    async function handleSubmit(e){
        e.preventDefault() 
        const title = e.currentTarget.title.value
       
        const res = await fetch(`${BASE_URL}/`, {
            method:"POST", 
            body: JSON.stringify({title}),
            headers:{
              'content-type': "application/json", 
             
            }
          }); 
        if(res.ok){
            alert('sucessfully submitted movie title')
        }
        
         
  
  }
  
    return (
        <form onSubmit={handleSubmit}>
                <div className='inputbox__container'>
                    <div className="inputbox">
                    
                    
                        <input required="required" type="text" id="movieTitle"  name="title" />
                        <span>Movie title</span>
                        <i></i>
                    

                    
                </div>

            
                <Box sx={{paddingTop: 10}}>
                    <button type= "submit">generate suggestions</button>
                </Box>
             </div>
    </form>
    )
}

export default InputBox