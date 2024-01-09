import * as React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'; 
const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
export default function ClickableChips() {
    const navigate = useNavigate()
   
  const handleClick = () => {
    Cookies.remove('token')
   
    console.info('logging out....');
    navigate('/login') 
  };
  

  return (
    <ThemeProvider theme={darkTheme}>
        <Stack direction="row" spacing={50}>
        <Chip label="Logout" onClick={handleClick} />
        
        </Stack>
    </ThemeProvider>
  );
}