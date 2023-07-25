import React from "react";
import { genres } from "../../utils/api";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function GenreFilter({selectedGenre, setSelectedGenre}) {

    const handleChange = (event) => {
        setSelectedGenre(event.target.value);
      };
    return (
        <div style={{width: '200px'}}>
      <FormControl sx={{width: '200px', mt: '1rem', ml: '3.5rem'}}>
        <InputLabel id="demo-simple-select-label">Genres</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedGenre}
          label="Genre"
          onChange={handleChange}
          name="genre"
          autoWidth
        >
          <MenuItem value=''>All Genres</MenuItem>
          <MenuItem value='Personal Growth'>Personal Growth</MenuItem>
          <MenuItem value='True Crime and Investigative Journalism'>True Crime and Investigative Journalism</MenuItem>
          <MenuItem value='History'>History</MenuItem>
          <MenuItem value='Comedy'>Comedy</MenuItem>
          <MenuItem value='Entertainment'>Entertainment</MenuItem>
          <MenuItem value='Business'>Business</MenuItem>
          <MenuItem value='Fiction'>Fiction</MenuItem>
          <MenuItem value='News'>News</MenuItem>
          <MenuItem value='Kids and Family'>Kids and Family</MenuItem>
         
        </Select>
      </FormControl>
   </div> 
    )
}