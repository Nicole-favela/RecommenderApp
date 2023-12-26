import React, { useEffect, useState } from 'react'
import { POSTER_URL } from '../config/urls';
import './ResultRow.css'



export default function ResultRow({title, recommendations}) {

  //for modal:
  const [open, setOpen] = React.useState(false);
 
 
//   const handleOpen = (i)=>{

//     setOpen(true)
   
//     setMovieIndex(i)
    
  
//   }
//   const handleClose = () => {
//     setOpen(false);
    
//   }

  return (
    <div className='result'>
        
        <h2>{title}</h2>
        <div className='result__posters'>
        {/* <BasicModal open={open} handleClose={handleClose} fetchUserList={fetchUserList} fetchPlayedList={fetchPlayedList}/> */}
       

        {recommendations.map((movie,index)=>
            ((movie.poster_path) && (
            
            <img className= 'result__poster'  key = {movie.id} src={`${POSTER_URL}${movie.poster_path}`} alt = {movie.title}/>
            
            )
        ))}
        </div>
        
    </div>
  )
}

