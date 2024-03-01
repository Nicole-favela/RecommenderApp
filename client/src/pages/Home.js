import React from 'react'
import CircularLoader from '../components/CircularLoader'
import TextAnimation from '../components/TextAnimation'
import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import axios from 'axios'
import { BASE_URL } from '../config/urls'
import useFetch from '../hooks/useFetch'
import  Button from '../components/Button'
import { useNavigate } from 'react-router-dom';
import MainLoader from '../components/MainLoader'

import InputBox from '../components/InputBox'
import './Home.css'
import ComboBox from '../components/DropDown'
import ResultRow from '../components/ResultRow'
import Cookies from 'js-cookie'
function Home() {
    const [isHoveredOver, setIsHoveredOver] = useState(false)
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState({})
    const [loadingOptions, setIsLoadingOptions]= useState(false)
    const [showResults, setShowResults] = useState(false)
    const [movieRecs, setMovieRecs] = useState([])
    const [movieId, setMovieId] = useState([])
    const token = Cookies.get('token')
    const [showUserList, setShowUserList] = useState(false)
    const showInputBox = ()=> setOpen(true)
    const USER_MOVIE_URL = `${BASE_URL}/usermovies_list`
    const {data: userMoviesData ,loading: userMoviesLoading ,error: userMoviesError} = useFetch(USER_MOVIE_URL, token)
    const navigate = useNavigate()

    
    useEffect(() => {
        const fetchTitles = async () => {
          try {
            setIsLoadingOptions(true)
            const res = await fetch(`${BASE_URL}/`, {
              headers:{
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
          }})
            if(res.status === 401){
              alert('Your session has expired, please login')
              Cookies.remove('token')
              navigate("/login")

            }
            const data = await res.json();
            //sort data alphabetically
            const sortedOptions =  {movies: data.movies.sort((a, b) =>
              a.label.localeCompare(b.label))};
            
           
            setOptions(sortedOptions);
          
          } catch (error) {
            console.error('Error fetching titles:', error);
          }finally{
            console.log('the options are: ', options)
            setIsLoadingOptions(false)
          }
        };
    
        fetchTitles();
      }, []);
   
    
    
  return (
  
  <div className='home'>
  <NavBar/>
  {loadingOptions ? (
      <div className="home__initial__state">
          
          <div>
          <MainLoader /> 
          {/* Render userMovies  */}
          {!userMoviesLoading && <ResultRow title={"My List"} movies={userMoviesData}/>}
          </div>
      </div>
  ) : (
      <>
          {isHoveredOver && <TextAnimation />}
          <div  className="home"
              onMouseEnter={() => setIsHoveredOver(true)}
              onMouseLeave={() => setIsHoveredOver(false)}
          >
              <CircularLoader onClick={()=>showInputBox()}/>
              {/* dropdown component */}
              <ComboBox options={options.movies} setMovieRecs={setMovieRecs} setMovieId={setMovieId}/>
              {movieRecs.length > 0 && <ResultRow title={"Recommendations:"} movies={movieRecs}/>}
              {!userMoviesLoading && <ResultRow title={"My List"} movies={userMoviesData}/>}
          </div>
      </>
  )}
</div>
  
  );
}

export default Home