
import { Button, ButtonGroup } from "@mui/material"

export default function SortFilter({ sortPodcast}) {


    return (
        <div className="filter--sort" >
        <ButtonGroup size="small" color="primary" variant="outlined" aria-label="outlined button group">
         <label>Sort By</label>
               <Button onClick={()=> sortPodcast("mostRecent")}>Most Recent</Button>
               <Button onClick={()=> sortPodcast("leastRecent")}>Least Recent</Button>
               <Button onClick={()=> sortPodcast("titleAZ")}>a - z</Button>
               <Button onClick={()=> sortPodcast("titleZA")}>z - a</Button>
             </ButtonGroup>
        </div>
    )
}