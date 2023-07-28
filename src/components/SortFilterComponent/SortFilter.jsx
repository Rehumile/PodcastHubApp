
import { Button, ButtonGroup } from "@mui/material"
import '../SortFilterComponent/SortFilter.css'

// eslint-disable-next-line react/prop-types
export default function SortFilter({ sortPodcast}) {


    return (
        <div className="filter--sort" >
            
        <ButtonGroup 
        size="small" 
        color="primary" 
        variant="outlined" 
        aria-label="outlined button group"
        sx={{ width: '18rem'}}
        >
         
               <Button onClick={()=> sortPodcast("mostRecent")}>Most Recent</Button>
               <Button onClick={()=> sortPodcast("leastRecent")}>Least Recent</Button>
               <Button onClick={()=> sortPodcast("titleAZ")}>a - z</Button>
               <Button onClick={()=> sortPodcast("titleZA")}>z - a</Button>
             </ButtonGroup>
        </div>
    )
}