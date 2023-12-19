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
         <ComboBox options={options.movies}/>
        {/* {isHoveredOver && <InputBox/>} */}
        {/* {isHoveredOver && <DropDown/>} */}
        {/* for testing */}
        {/* {options.titles.slice(0,20).map((t, index)=> (<p>{t}</p>))} */}
        {/* TODO: add results list here */}
      
        </div>
       
    </div>
  )
}

export default Home