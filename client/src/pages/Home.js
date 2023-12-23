import React from 'react'
import CircularLoader from '../components/CircularLoader'
import TextAnimation from '../components/TextAnimation'
import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import { BASE_URL } from '../config/urls'


import InputBox from '../components/InputBox'
import './Home.css'
import ComboBox from '../components/DropDown'
function Home() {
    const [isHoveredOver, setIsHoveredOver] = useState(false)
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState({})
    const [showResults, setShowResults] = useState(false)
    const [movieRecs, setMovieRecs] = useState([])
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
                <ComboBox options={options.movies} setShowResults={setShowResults} setMovieRecs={setMovieRecs}/>

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
             {/* <ComboBox options={options.movies}/> */}
         
            {/* TODO: add results list here */}
            <p>Recommendations: </p>
            <br/>
          
            <p>{movieRecs[0]}</p>
            <p>{movieRecs[1]}</p>
            <p>{movieRecs[2]}</p>
            <p>{movieRecs[3]}</p>
            <p>{movieRecs[4]}</p>
          
            </div>
           
        </div>
        )
      }
    
  return (
    <>
    {movieRecs.length == 0 ? renderHome(): renderResults()}
    </>
   
  )
}

export default Home