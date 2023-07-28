import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import GoBack from "../GoBack/GoBack";
import "../SinglePodcastDetails/SinglePodcastDetails.css";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SmartDisplayOutlinedIcon from "@mui/icons-material/SmartDisplayOutlined";
import { ColorRing } from "react-loader-spinner";

export default function SinglePodcastDetails({
  // eslint-disable-next-line react/prop-types
  podcastId,
  // eslint-disable-next-line react/prop-types
  onGoBack,
  // eslint-disable-next-line react/prop-types
  toggleFavourite,
  // eslint-disable-next-line react/prop-types
  playSelectedEpisode,
}) {
  // set state for the single show info
  const [singleShow, setSingleShow] = useState(null);

  // set state for loading
  const [loadingDetails, setLoadingDetails] = useState(true);

  //set state for selected genre
  const [selectedSeason, setSelectedSeason] = useState(1);

  //set state to store selected season data
  const [selectedSeasonData, setSelectedSeasonData] = useState(null);

  /**
   * async function to fetch specific shows data using the Show ID
   */
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
      }
    };

    fetchSinglePodcast();
  }, [podcastId]);

  useEffect(() => {
    if (singleShow && singleShow.seasons) {
      const seasonData = singleShow.seasons.find(
        (season) => season.season === selectedSeason
      );
      setSelectedSeasonData(seasonData);
    }
  }, [selectedSeason, singleShow]);

  
  /**
   * Function that handles the selection of a season's data in a show, and sets it to state
   * @param {Object} event 
   */
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

  // when data is being fetched, loading spinner will be rendered
  if (loadingDetails) {
    return (
      <div className="loading--icon">
        <ColorRing
          visible={true}
          height="150"
          width="150"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={["#003EAB", "#008033", "#EEF3F6", "#003EAB", "#008033"]}
        />
      </div>
    );
  }

  /**
   * helper function to shorten characters of long paragraphs
   * @param {String} text 
   * @param {Number} maxCharacters 
   * @returns 
   */
  const shortenDescription = (text, maxCharacters) => {
    if (text.length <= maxCharacters) {
      return text;
    }
    return text.slice(0, maxCharacters) + "...";
  };

  return (
    <div className="single-show">
      <Link to="/">
        <GoBack onGoBack={onGoBack} />
      </Link>

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

            <p className="show--descrip">
              {shortenDescription(singleShow.description, 200)}
            </p>
            <span className="bold">Show More</span>
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
          <div className="season--details">
            <p>Episodes ({selectedSeasonData.episodes.length})</p>

            <h2 className="season--title">{selectedSeasonData.title}</h2>
          </div>
          {selectedSeasonData.episodes.map((episode) => (
            <div key={episode.episode} className="episodes">
              <div className="episodeNum--Title">
                <p className="episode--number">{episode.episode}</p>
                <h6 className="title">{episode.title}</h6>
              </div>
              <p className="description">
                {shortenDescription(episode.description,200)}
              </p>

              <div className="episode--buttons">
                <div
                  onClick={() =>
                    playSelectedEpisode(
                      episode,
                      singleShow.id,
                      selectedSeasonData
                    )
                  }
                  className="play--button"
                >
                  <IconButton
                    aria-label="playbutton"
                    size="large"
                    sx={{ color: "#008033", fontSize: "2rem" }}
                  >
                    <SmartDisplayOutlinedIcon fontSize="inherit" />
                  </IconButton>
                </div>
                <div
                  onClick={() =>
                    toggleFavourite(singleShow, selectedSeasonData, episode)
                  }
                >
                  <IconButton
                    sx={{
                      m: "auto",
                      mr: "3rem",
                      color: "red",
                    }}
                    aria-label="favoourite"
                    size="small"
                  >
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
