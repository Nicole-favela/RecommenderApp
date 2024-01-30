import React, { useState } from 'react'

import Box from '@mui/material/Box';

import Modal from '@mui/material/Modal';
import './DetailsModal.css'
import Cookies from 'js-cookie';
import { BASE_URL } from '../config/urls';
import {jwtDecode} from 'jwt-decode'


const style = {
    position: 'absolute',
    top: '55%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 600,
    bgcolor: '#000000',
    boxShadow: 100,
  
   
  };

function DetailsModal({open, handleClose, movie}) {
  const moviePoster = `url("https://image.tmdb.org/t/p/original/${movie?.poster_path}")`
  const [on_my_list, set_on_my_list]= useState(false)//temp state, replace with db value
  const [creditsLoading, creditsSetLoading]= useState(false)
  function truncateDescription(string, cutoffChar){
      return string?.length > cutoffChar ? string.substr(0, cutoffChar -1) + '...' : string;
   }
  function formatCredits(credits){
      
    if(!credits || credits === undefined ){
      return ''
    }
    if (credits.length === 3){   
          const castNames = credits?.cast?.map((actor)=> actor.name)
          return castNames?.join(', ')
    }
    if (credits.lenght ===5 ){
        const filteredTitles = credits?.crew?.filter(res=> res.job === 'Executive Producer' || res.job === 'Director')
        const names = filteredTitles?.map((producer)=> producer.name)
        
        return names?.join(', ')

    }
  }
   
   async function addMovie(movie){
    const token = Cookies.get('token')
    const decoded = jwtDecode(token)
    const user_id = decoded.sub
    console.log('Token:', token);
    console.log('user is is: ', user_id);
    console.log('Movie to be added: ', movie);


    const movie_data = {
      
        movie_id: movie.id,
        title: movie.title,
        overview: movie.overview,
        user_id:  user_id,
        date: movie.date,
        poster: movie?.poster_path,
        cast: movie.cast ?? [], 
        crew: movie.crew ?? [], 
    

    }
    console.log('Movie to be added after restructure: ', movie_data);
    const res = await fetch(`${BASE_URL}/add_to_list`, {
        method:"POST", 
        body: JSON.stringify(movie_data),
        headers:{
          'content-type': "application/json", //makes sure json format is sent to backend
          Authorization: `Bearer ${token}`,
        }
      });
      console.log('res from add to list is: ', res)
      if (!res.ok){
        const errorData = await res.json();
        console.error('Error:', errorData);
      }

   }
    
  return (
    <div>
    
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
        
    <header className='banner' style={{
        backgroundSize: "cover",
        backgroundImage: moviePoster,
        backgroundPosition: "center center",
    
    }}>
    
        <div className='banner__contents'>
            <h4 className='banner__title'>
                    {movie?.title}
            </h4>
            <div className='banner__details'>
            {new Date(movie?.date).getFullYear() }
                <h2 className='banner__description'>
                
                    {truncateDescription(movie?.overview, 200)}

                </h2>

            </div>

            <div className='banner__buttons'>
               
               
            {on_my_list ===true ? (
                   <button className='detailedview__button' >
                   Remove
                    </button>
                
                ):
                <button className='detailedview__button' onClick={()=>addMovie(movie)} >
                + My List
                 </button>
                }
            
            </div>

            {/* credits: */}
            
            
                
                <div className="detailedview__credits">
                Cast: {formatCredits(movie?.cast)}
                <br/>
                Creators: {formatCredits(movie?.crew)}
                </div>
          
          

                {/* TODO: more related movies options */}
        
        {/* <div className='detailedview__description'>              
                {(!recLoading && (recommendations?.length >=1 || recommendations !== undefined) ) &&
                <>
                    <h3 className='detailedview__title'>
                    More Like This
                </h3>
                    <div className='detailedview__posters'>
                    {recommendations?.slice(0,9).map((recommendation,index)=>
                        (recommendation.backdrop_path  && (
                            <div className='detailedview__container'>
                            
                                <img className='detailedview__poster'  onClick={()=>handleViewSwap(recommendation)} key = {index} src={`${imgUrl}${recommendation?.backdrop_path || recommendation?.poster_path}`} alt = {recommendation?.name}/>
                                <h4 className='detailedview__moviename'>{truncateDescription(recommendation?.title, 15)}</h4>
                            </div>
                        )
                    ))}
                </div>
                </>

                }
        
        </div> */}
        {/* )} */}

        </div>
        </header>
        </Box>
        </Modal>
  </div>
  

  )
}

export default DetailsModal

