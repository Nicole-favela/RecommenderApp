import React, { useEffect, useState } from 'react'




export default function ResultRow({title}) {

  //for modal:
  const [open, setOpen] = React.useState(false);
 
 
  const handleOpen = (i)=>{

    setOpen(true)
   
    setMovieIndex(i)
    
  
  }
  const handleClose = () => {
    setOpen(false);
    
  }

  return (
    <div className='result'>
        
        <h2>{title}</h2>
        <div className='result__posters'>
        <BasicModal open={open} handleClose={handleClose} fetchUserList={fetchUserList} fetchPlayedList={fetchPlayedList}/>
       

        {movies.map((movie,index)=>
            ((movie.backdrop_path || movie.poster) && (
            <img className= 'result__poster'  onClick={()=>handleOpen(index, movie)} key = {movie.id} src={`${imgUrl}${movie.backdrop_path}`} alt = {movie.name}/>
            )
        ))}
        </div>
        
    </div>
  )
}

