import React, { useEffect, useState } from 'react'
import { POSTER_URL } from '../config/urls';
import './ResultRow.css'
import DetailsModal from './DetailsModal';



export default function ResultRow({title, movies}) {

  //for modal:
  const [open, setOpen] = React.useState(false);
  const [index, setIndex]= useState(0)
 
 
  const handleOpen = (movie,i)=>{
    console.log('movie seelcted is movie: ', movie, ' index is: ', i)
    setOpen(true)
    setIndex(i)
  }
  const handleClose = () => {
    setOpen(false);
    
  }

  return (
    <div className='result'>
        
        <h2>{title}</h2>
        <div className='result__posters'>
       
       <DetailsModal open={open} handleClose={handleClose} movie={movies[index]}/>

        {movies.map((movie,index)=>
            ((movie.poster_path ) && (
            
            <img className= 'result__poster' onClick={()=>handleOpen(movie, index)} key = {movie.id} src={`${POSTER_URL}${movie.poster_path}`} alt = {movie.title}/>
            
            )
        ))}
        </div>
        
    </div>
  )
}

