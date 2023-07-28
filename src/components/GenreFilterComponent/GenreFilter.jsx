import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// eslint-disable-next-line react/prop-types
export default function GenreFilter({selectedGenre, setSelectedGenre}) {

  /**
   * Function to set state of he genre that was selected
   * @param {Object} event 
   */
    const handleChange = (event) => {
        setSelectedGenre(event.target.value);
      };
    return (
        <div>
      <FormControl  sx={{width: '17rem', borderRadius: '5px'}}>
        <InputLabel >Genres</InputLabel>
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