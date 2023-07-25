import * as React from 'react';
import { useState, useEffect } from 'react';
import {useNavigate, Link} from 'react-router-dom'
import {Tabs, Tab} from '@mui/material'
import {AppBar, Box, Toolbar, Typography} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';

export default function Navbar({handleFavNavigation}) {

// state for keeping the value of the tab
const [tabValue, setTabValue] = useState(0)


//  handle change 
 const handleChange = (event, newValue) => {
   setTabValue(newValue)
 
  
 }

 
//section for routing
 const navigate = useNavigate();
 useEffect(()=> {
    if(tabValue ===0 ) navigate('/')
    if(tabValue===1) {
      navigate('/favourites')
    handleFavNavigation()
    }
    if(tabValue === 2) navigate('/login')
 },[tabValue])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" >
        <Toolbar>
            {/*icon for podcast */}


             <Link to="/">
                <img src='./public/images/play-button2.png' style={{width: '60px', height: '40px', paddingRight: '1rem'}}/>
                </Link>  
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Podcast Hub
          </Typography>
        
          <Tabs 
          textColor="secondary"
          value={tabValue} 
          onChange={handleChange} 
          sx={{
            "& button": { borderRadius: 2 },
            "& button:hover": { backgroundColor: "black" },
            "& button:focus": { backgroundColor: "yellow" },
            "& button:active": { backgroundColor: "green" }
          }}
          >
              <Tab  iconPosition="top" sx={{color: 'white'}} label="Home"/>
            <Tab  iconPosition="top" sx={{color: 'white',}} label="Favourites"/>
              <Tab iconPosition="top" sx={{color: 'white'}}  label="Login"/>
            </Tabs>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
// 