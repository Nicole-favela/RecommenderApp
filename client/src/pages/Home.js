import React from 'react'
import CircularLoader from '../components/CircularLoader'
import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import axios from 'axios'
import { BASE_URL } from '../config/urls'
import useFetch from '../hooks/useFetch'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom';
import MainLoader from '../components/MainLoader'
import './Home.css'
import ComboBox from '../components/DropDown'
import ResultRow from '../components/ResultRow'
import Cookies from 'js-cookie'

function Home() {
  const [isHoveredOver, setIsHoveredOver] = useState(false)
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState({})
  const [loadingOptions, setIsLoadingOptions] = useState(false)

  const [movieRecs, setMovieRecs] = useState([])
  const [movieId, setMovieId] = useState([])
  const token = Cookies.get('token')
  const [showUserList, setShowUserList] = useState(false)
  const showInputBox = () => setOpen(true)
  const USER_MOVIE_URL = `${BASE_URL}/usermovies_list`
  const [userMoviesData, setUserMoviesData] = useState([])
  const [userMoviesLoading, setUserMoviesLoading] = useState(false)
  const [userMoviesError, setuserMoviesError] = useState('')

  // const {data: userMoviesData ,loading: userMoviesLoading ,error: userMoviesError} = useFetch(USER_MOVIE_URL, token)
  const navigate = useNavigate()


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token')
        if (!token) {
          return
        }
        fetchTitles(BASE_URL, token)
        fetchUserList(USER_MOVIE_URL, token)

      } catch (e) {
        console.log('error fetching users data: ', e)

      }
    }


    fetchData();
  }, []);
  async function fetchTitles(BASE_URL, token) {
    try {
      setIsLoadingOptions(true)
      const res = await fetch(`${BASE_URL}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      })
      if (res.status === 401) {
        alert('Your session has expired, please login')
        Cookies.remove('token')
        navigate("/login")

      }
      const data = await res.json();
      //sort data alphabetically
      const sortedOptions = {
        movies: data.movies.sort((a, b) =>
          a.label.localeCompare(b.label))
      };


      setOptions(sortedOptions);

    } catch (error) {
      console.error('Error fetching titles:', error);
    } finally {
      console.log('the options are: ', options)
      setIsLoadingOptions(false)
    }
  };
  async function fetchUserList(url, token) {
    try {
      setUserMoviesLoading(true)
      const headers = { 'Authorization': `Bearer ${token}` }
      const response = await axios.get(url, { headers })

      //parse the cast and crew data
      const parsedData = response.data.movies_list.map((movie) => ({
        ...movie,
        crew: JSON.parse(movie.crew),
        cast: JSON.parse(movie.cast),
      }));


      console.log('in usefetch hook, response is: ', parsedData)

      setUserMoviesData(parsedData)
    } catch (err) {
      setuserMoviesError(err)
    } finally {
      setUserMoviesLoading(false)
    }
  }



  return (

    <div className='home'>
      <NavBar />
      {loadingOptions ? (
        <div className="home__initial__state">

          <div>
            <MainLoader />
            {/* Render userMovies  */}
            {!userMoviesLoading && <ResultRow title={"My List"} movies={userMoviesData} />}
          </div>
        </div>
      ) : (
        <>

          <div className="home"
            onMouseEnter={() => setIsHoveredOver(true)}
            onMouseLeave={() => setIsHoveredOver(false)}
          >
            <CircularLoader onClick={() => showInputBox()} />
            {/* dropdown component */}
            <ComboBox options={options.movies} setMovieRecs={setMovieRecs} setMovieId={setMovieId} />
            {movieRecs.length > 0 && <ResultRow title={"Recommendations:"} movies={movieRecs} />}
            {!userMoviesLoading && <ResultRow title={"My List"} movies={userMoviesData} />}
          </div>
        </>
      )}
    </div>

  );
}

export default Home