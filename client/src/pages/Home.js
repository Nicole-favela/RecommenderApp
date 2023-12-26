import React from 'react'
import CircularLoader from '../components/CircularLoader'
import TextAnimation from '../components/TextAnimation'
import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import axios from 'axios'
import { BASE_URL } from '../config/urls'


import InputBox from '../components/InputBox'
import './Home.css'
import ComboBox from '../components/DropDown'
import ResultRow from '../components/ResultRow'
function Home() {
    const [isHoveredOver, setIsHoveredOver] = useState(false)
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState({})
    const [showResults, setShowResults] = useState(false)
    const [movieRecs, setMovieRecs] = useState([])
    const [movieId, setMovieId] = useState([])
    const showInputBox = ()=> setOpen(true)
    
    useEffect(() => {
        const fetchTitles = async () => {
          try {
            const res = await fetch(`${BASE_URL}/`);
            const data = await res.json();
            setOptions(data);
            console.log(data)
          } catch (error) {
            console.error('Error fetching titles:', error);
          }finally{
            console.log('the options are: ', options)
          }
        };
    
        fetchTitles();
      }, []);
      const renderHome = () => {
       
          return (
            <div className='home'>
            <NavBar/>
            {isHoveredOver && <TextAnimation />}
            <div
                onMouseEnter={() => setIsHoveredOver(true)}
                onMouseLeave={() => setIsHoveredOver(false)}
            
            >

                <CircularLoader
                onClick={()=>showInputBox()}
                />

                {/* only show if no results */}
                <ComboBox options={options.movies}  setMovieRecs={setMovieRecs} setMovieId={setMovieId}/>

                <p>{}</p>
                </div>
            
            </div>
          );
        
      };
      const renderResults=()=>{
       
        return(
            <div className='home'>
            <NavBar/>
           {isHoveredOver && <TextAnimation />}
           <div
            onMouseEnter={() => setIsHoveredOver(true)}
            onMouseLeave={() => setIsHoveredOver(false)}
         
           >
            <CircularLoader
              onClick={()=>showInputBox()}
            />
           
            <br/>
          
           {/* {movieRecs && movieRecs?.map((recommendations, i)=>(
            <div key={recommendations.id}>
                <h2>{recommendations.title}</h2>
                
            </div>
           ))} */}

           <ResultRow title ={"Your Recommendations:"} recommendations={movieRecs}/>
        
            </div>
           
        </div>
        )
      }
    
  return (
    <>
    {movieRecs.length === 0 ? renderHome(): renderResults()}
    </>
   
  )
}

export default Home