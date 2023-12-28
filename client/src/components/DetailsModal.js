import React, { useState } from 'react'

import Box from '@mui/material/Box';

import Modal from '@mui/material/Modal';
import './DetailsModal.css'


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
                <button className='detailedview__button' >
                + My List
                 </button>
                }
            
            </div>

            {/* credits: */}
            
                {creditsLoading ? (
                // show a loading indicator while data is being fetched
                <div className="detailedview__loading">
                Loading credits...
                </div>
            ) : (
                // render credits when available
                <div className="detailedview__credits">
                Cast: 
                <br/>
                Creators: 
                </div>
            )}
          

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

// import * as React from 'react';

// import Box from '@mui/material/Box';

// import Modal from '@mui/material/Modal';
// import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
// import useRecommendations from '../hooks/useRecommendations';
// import useCredits from '../hooks/useCredits';
// import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// import './DetailedView.css'
// import { useSelector,useDispatch } from 'react-redux'
// import { selectUser, selectIsPlaying,  setPlaying, setMovieSelection, selectCurrentMovie} from '../features/userSlice'
// import { useState, useEffect } from 'react';

// import VideoPlayer from './VideoPlayer';
// import Cookies from 'js-cookie';
// import {jwtDecode} from 'jwt-decode'
// import { API_BASE_URL } from '../config/apiUrls';


// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 600,
//   height: 900,
//   bgcolor: '#000000',
// //   border: '4px solid #FF0D86',
//   boxShadow: 100,

 
// };

//  export default function BasicModal({open, handleClose, fetchUserList, fetchPlayedList}) {
//     const dispatch = useDispatch()
//     const user = useSelector(selectUser)
//     const newMovie = useSelector(selectCurrentMovie) //the movie selected: replaces movies[movieIndex]
//     const moviePoster = `url("https://image.tmdb.org/t/p/original/${newMovie?.backdrop_path || newMovie?.poster}")`
//     const token = Cookies.get('token')
//     const decoded = jwtDecode(token)
//     const user_id = decoded._id
//     const [like, setLike] = useState(false)
//     const [onlist, setOnList] = useState(false)
//     const [recentlyPlayed, setRecentlyPlayed] = useState(false)
//     const [openVideoPlayer, setOpenVideoPlayer] = useState(false)
    
    
//     const movieSeed =newMovie?.id //movie recommendations are based on- current movie selected
    
//     const recommendationsUrl = `${API_BASE_URL}/content/movie/recommendations?movie_id=${movieSeed}`
//     const {data: recommendations,loading: recLoading ,error: recError} = useRecommendations(recommendationsUrl)

//     //get credits for particular movie:
//     const creditsUrl = `${API_BASE_URL}/content/movie/credits?movie_id=${movieSeed}`
//     const {data: movieCredits,loading: creditsLoading ,error: creditsError} = useCredits(creditsUrl)
//     const imgUrl = 'https://image.tmdb.org/t/p/original'
//     if (creditsLoading || recLoading) {
//       return <div>Loading...</div>;
//     }
    
//     function truncateDescription(string, cutoffChar){
//         return string?.length > cutoffChar ? string.substr(0, cutoffChar -1) + '...' : string;
//      }
    
   
//     function getTop5CastMembers(credits){
//       if(!credits || credits === undefined ){
//         return ''
//       }
     
//       const castNames = credits?.cast?.slice(0,3).map((actor)=> actor.name)
//       return castNames?.join(', ')
//     }
//     function getProducers(credits){
      
//       if(!credits || credits === undefined ){
//         return ''
//       }
//       const topFive = credits?.crew?.filter(res=> res.job === 'Executive Producer' || res.job === 'Director')
//       const names = topFive?.slice(0,3).map((producer)=> producer.name)
      
//       return names?.join(', ')
//     }
  
//     async function addToList(movie){
//         setOnList(true) 
//         const movie_data = {
//             played: recentlyPlayed,
//             on_my_list: true,
//             rating: like,
//             id: movie.id,
//             title: movie.title,
//             overview: movie.overview,
//             user_id: user?.user_id || user_id,
//             release_date: movie.release_date,
//             poster: movie?.backdrop_path,
        

//         }
//         const res = await fetch(`${API_BASE_URL}/movie-list`, {
//             method:"POST", //creates transaction
//             body: JSON.stringify(movie_data),
//             headers:{
//               'content-type': "application/json", //makes sure json format is sent to backend
//               Authorization: `Bearer ${token}`,
//             }
//           });
//         if(res.ok){
//           fetchUserList(user_id, token)
         
         
//         }
     
//     }
    
//     async function addToPlayedList(movie){
//       dispatch(setPlaying(movie)) //set the current movie selected to play
//       setOpenVideoPlayer(true)
//       setRecentlyPlayed(true)
    
//       const movie_data = {
//         played: true,
//         on_my_list: onlist,
//         rating: like,
//         id: movie.id,
//         title: movie.title,
//         overview: movie.overview,
//         user_id: user?.user_id || user_id,
//         release_date: movie.release_date,
//         poster: movie?.backdrop_path,
    

//     }
//     const res = await fetch(`${API_BASE_URL}/movie-list/recently-watched`, {
//         method:"POST", //creates movie
//         body: JSON.stringify(movie_data),
//         headers:{
//           'content-type': "application/json", //makes sure json format is sent to backend
//           Authorization: `Bearer ${token}`,
         
//         }
//       });
//     if(res.ok){
//       //fetchPlayedList()
   
//     }
  
//     }
//     async function deleteFromList(movie){
//       const _id =  movie?._id
//       const res = await fetch(`${API_BASE_URL}/movie-list/${_id}`, {
//         method: "DELETE",
        
//       });
//       if(res.ok){
//         fetchUserList(user_id, token) //updates and refetches after deletion
       
//       }

//     }
//     const handleViewSwap=(newMovie)=>{
//       dispatch(setMovieSelection(newMovie))
     
//     }
       
//   return (
    
//     <div>
    
//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={style}>
        
//     <header className='banner' style={{
//         backgroundSize: "cover",
//         backgroundImage: moviePoster,
//         backgroundPosition: "center center"
//     }}>
     
//         <div className='banner__contents'>
//             <h4 className='banner__title'>
//                     {newMovie?.title ||  newMovie?.original_title}
//             </h4>
//             <div className='banner__details'>
//             {new Date(newMovie?.release_date).getFullYear() }
//                 <h2 className='banner__description'>
                 
//                   {truncateDescription(newMovie?.overview, 200)}

//                 </h2>

//             </div>

//             <div className='banner__buttons'>
//                 <button className='detailedview__button'  onClick={()=> addToPlayedList(newMovie)}>
//                     <PlayArrowRoundedIcon className='detailedview__button-icon' fontSize='small' />
//                     Play
//                 </button>
//                 {newMovie?.on_my_list ===true ? (
//                    <button className='detailedview__button'  onClick={()=>deleteFromList(newMovie)}>
//                    Remove
//                     </button>
                
//                 ):
//                 <button className='detailedview__button'  onClick={()=>addToList(newMovie)}>
//                 + My List
//                  </button>
//                 }
//                 <ThumbUpIcon
//                     color="inherit" 
//                     onClick={()=>setLike(true)}
//                 />

            
//             </div>

//             {/* credits: */}
           
//               {creditsLoading ? (
//               // show a loading indicator while data is being fetched
//               <div className="detailedview__loading">
//                 Loading credits...
//               </div>
//             ) : (
//               // render credits when available
//               <div className="detailedview__credits">
//                 Cast: {getTop5CastMembers(movieCredits)}
//                 <br/>
//                 Creators: {getProducers(movieCredits)}
//               </div>
//             )}
//             {(openVideoPlayer) &&  <VideoPlayer  openVideoPlayer={openVideoPlayer} setOpenVideoPlayer={setOpenVideoPlayer} />  }

//               {/* more related episode options */}
      
//         <div className='detailedview__description'>              
//                 {(!recLoading && (recommendations?.length >=1 || recommendations !== undefined) ) &&
//                 <>
//                   <h3 className='detailedview__title'>
//                   More Like This
//                  </h3>
//                   <div className='detailedview__posters'>
//                      {recommendations?.slice(0,9).map((recommendation,index)=>
//                         (recommendation.backdrop_path  && (
//                             <div className='detailedview__container'>
                           
//                               <img className='detailedview__poster'  onClick={()=>handleViewSwap(recommendation)} key = {index} src={`${imgUrl}${recommendation?.backdrop_path || recommendation?.poster_path}`} alt = {recommendation?.name}/>
//                               <h4 className='detailedview__moviename'>{truncateDescription(recommendation?.title, 15)}</h4>
//                             </div>
//                         )
//                     ))}
//                  </div>
//                  </>

//                 }
        
//         </div>
//         {/* )} */}

//         </div>
//         </header>
//         </Box>
//       </Modal>
//     </div>
    
//   );
  
// }