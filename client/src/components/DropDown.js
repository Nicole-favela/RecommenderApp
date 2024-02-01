import * as React from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import './DropDown.css'
import { BASE_URL } from '../config/urls';
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

export default function ComboBox({options, setMovieRecs, setMovieId}) {
   const [form, setForm] = useState({})
   const navigate = useNavigate()
   async function handleSubmit(e){
        e.preventDefault() //prevent default submission of form
        const token = Cookies.get('token')
       
        const res = await fetch(`${BASE_URL}/`, {
            method:"POST", 
            body: JSON.stringify(form),
            headers:{
              'content-type': "application/json", 
              Authorization: `Bearer ${token}`,
             
            }
          }); 
        const data = await res.json(); //get recommendations array back
        if(!res.ok){
          console.log('error in dropdown when submitting movie selection: ', res)
        }
        if (res.ok){
          
            const parsedRecommendations = data.recomendations.map((recommendation) => ({
            ...recommendation,
            crew: JSON.parse(recommendation.crew),
            cast: JSON.parse(recommendation.cast),
            }));
            
            setMovieRecs(parsedRecommendations)
            console.log('the recommendations are: ',parsedRecommendations)
        }
  
      }
      
   return (
    <ThemeProvider theme={darkTheme}>
        <div className='inputbox__container'>
        <Box component='form' onSubmit={handleSubmit} sx={{paddingTop: 10}}>
            
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            name='title'
            type='text'
            options={options}
            sx={{ width: 400, height: 50 }}
            onChange={(e, newValue) => {
                setForm({...form,  title: newValue});
            }}
            renderInput={(params) =>
                <TextField {...params} label="Movie" color='primary' 
            />}
        />

       
            <button className='glitch__btn' type= "submit">Generate</button>
        </Box>
        </div>
    </ThemeProvider>
  );
}

