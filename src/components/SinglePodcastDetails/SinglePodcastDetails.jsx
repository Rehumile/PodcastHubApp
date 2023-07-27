import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import GoBack from "../GoBack/GoBack";
import Container from "@mui/material/Container";
import "../SinglePodcastDetails/SinglePodcastDetails.css";
 import IconButton from "@mui/material/IconButton";
 import FavoriteIcon from "@mui/icons-material/Favorite";
 import SmartDisplayOutlinedIcon from "@mui/icons-material/SmartDisplayOutlined";

export default function SinglePodcastDetails({ podcastId, onGoBack, toggleFavourite, playSelectedEpisode}) {
  // set state for the single show info
  const [singleShow, setSingleShow] = useState(null);

  // set state for loading
  const [loadingDetails, setLoadingDetails] = useState(true);

  // set state for when there is an error in fetching single podcast show
  const [isError, setIsError] = useState(false);

  //set state for selected genre
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedSeasonData, setSelectedSeasonData] = useState(null);

  //set state for whether text should be truncated or now
  const [isWordsTruncated, setIsWordsTruncated] = useState(true)

  //fetch the data for single podcast
   useEffect(() => {
  const fetchSinglePodcast = async () => {
    try {
      const data = await fetch(
        `https://podcast-api.netlify.app/id/${podcastId}`
      );
      const result = await data.json();

      setSingleShow(result);
      setLoadingDetails(false);
    } catch (error) {
      console.log(`ERROR ${error}`);
      // setIsError(true);
    }
  };

  //render fetch podcast only once
 
    fetchSinglePodcast();
  }, [podcastId]);


  // useEffect(() => {
  //     if (singleShow) {
  //       const seasonData = singleShow.seasons.find(
  //         (season) => season.season === selectedSeason
  //       );
  //       setSelectedSeasonData(seasonData);
  //     }
  //   }, [selectedSeason, singleShow]);

  useEffect(() => {
    if (singleShow && singleShow.seasons) {
      const seasonData = singleShow.seasons.find(
        (season) => season.season === selectedSeason
      );
      setSelectedSeasonData(seasonData);
    }
  }, [selectedSeason, singleShow])

  // Handles the selection of a season's data in a show, and sets it to state
  const handleSelectSeason = (event) => {
    const seasonNum = parseInt(event.target.value);
    setSelectedSeason(seasonNum);
    if (singleShow) {
      const seasonData = singleShow.seasons.find(
        (season) => season.season === seasonNum
      );
      setSelectedSeasonData({ ...seasonData });
    }
  };

  

  const handleToggleDescription =() => {
    setIsWordsTruncated(!isWordsTruncated);
  }
  const MAX_CHARACTERS = 200

  
//   let descriptionElement;
//   if (singleShow.description.length >= MAX_CHARACTERS) {
//     if (isWordsTruncated) {
//       descriptionElement = (
//         <>
//           <p>{singleShow.description.substring(0, MAX_CHARACTERS)}...</p>
//           <button onClick={handleToggleDescription}>Show More</button>
//         </>
//       );
//     } else {
//       descriptionElement = (
//         <>
//           <p>{singleShow.description}</p>
//           <button onClick={handleToggleDescription}>Show Less</button>
//         </>
//       );
//     }
//   } else {
//     descriptionElement = <p>{singleShow.description}</p>;
//   }
const clampText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  }

  return (
    <div className="single-show">
    
        <Link to='/'>
     <GoBack onGoBack={onGoBack}/></Link>  
       
        
  {singleShow && (
<div className="show" key={singleShow.id}>
          <img className="show--image" src={singleShow.image} />
          <div className="details--container">
            <h1 className="show--Title">{singleShow.title}</h1>
            <p className="show--seasons">
              <p>
                {singleShow.seasons
                  ? `${singleShow.seasons.length} seasons`
                  : "Seasons data not available"}
              </p>
            </p>
            
           <p className="show--descrip">{clampText(singleShow.description)}</p><span className="bold">Show More</span>
          </div>
        </div>

   )}
        

        <div className="season--form">
            {
              <form>
                <select
                  onChange={handleSelectSeason}
                  value={selectedSeason}
                  name="Seasons"
                >
                  {singleShow &&
                    singleShow.seasons.map((season) => (
                      <option key={season.season} value={season.season}>
                        Season {season.season}
                      </option>
                    ))}
                </select>
              </form>
            }
        </div>

          {selectedSeasonData && (
          <>
          <div className="season--details" >
            <p>Episodes ({selectedSeasonData.episodes.length})</p>

            <h2 className="season--title">{selectedSeasonData.title}</h2>
            </div>
            {selectedSeasonData.episodes.map((episode) => (

              <div key={episode.episode} className="episodes">
                <div className="episodeNum--Title">
                <p className="episode--number">{episode.episode}</p>
                <h6 className="title">{episode.title}</h6>
                </div>
                 <p className="description">{clampText(episode.description)}</p>
                 
                 <div className="episode--buttons">
                <div onClick={()=>playSelectedEpisode(episode, singleShow.id, selectedSeasonData)} className="play--button">
                  <IconButton
                    aria-label="playbutton"
                    size="large"
                    sx={{ color: "#008033", fontSize: "2rem" }}
                  >
                    <SmartDisplayOutlinedIcon fontSize="inherit" />
                  </IconButton>
                </div> 
                   <div onClick={()=>(toggleFavourite(singleShow, selectedSeasonData, episode))}>
                    <IconButton
                      sx={{
                        m: "auto",
                        mr: "3rem",
                        color: "red",
                      }}
                      aria-label="favoourite"
                      size="small">
                      <FavoriteIcon fontSize="inherit" />
                    </IconButton>
                  </div> 
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    
  );
}
