import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Logo from '../components/Logo';
import { useState } from 'react';
import { BASE_URL } from '../config/urls';
import { useNavigate } from 'react-router-dom';


const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

export default function SignUp() {
  const [form, setForm] = useState({})
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  async function handleSubmit(event) {
    event.preventDefault();
    
    const form = {
        email,
        password,
        userName,
      }
    try{
        console.log(form)
        const res = await fetch(`${BASE_URL}/sign_up`, {
            method:"POST", 
            body: JSON.stringify(form),
            headers:{
            'content-type': "application/json", 
            
            }
        }); 
        const data = await res.json(); 
        
        if (res.ok){
            
            console.log('successfullly submitted form')
            setMessage('Account created successfully')
            navigate("/")// go to home page
            
        }
        else{
          setMessage(data.error)
        }
    }catch(err){
        console.log('error registering user', err)
    }
  };

  return (
   <>
    
    <ThemeProvider theme={darkTheme}>
      <Container component="main" maxWidth="xs">
      <Logo/>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          
          </Avatar> */}
         
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
              </Grid>
              <Grid item xs={12} >
                <TextField
                  required
                  fullWidth
                  id="userName"
                  label="Username"
                  name="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  autoComplete="user-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                {/* <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                /> */}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 1 }}
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
            {message && <p>{message}</p>}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
       
      </Container>
    </ThemeProvider>
    </>
  );
}