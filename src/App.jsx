import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "./components/NavbarComponent/Navbar";
import PodcastPreview from "./Pages/PodcastPreview/PodcastPreview";
import Favourites from "./Pages/Favourites/Favourites";
import Login from "./Pages/Login/Login";
import SinglePodcastDetails from "./components/SinglePodcastDetails/SInglePodcastDetails";
import AudioPlayer from './components/AudioPlayer/AudioPlayer'

function App() {
  const [selectedPodcastId, setSelectedPodcastId] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [viewFavouritesPage, setViewFavouritesPage] = useState(false);

  //set state for selected episode to be played
  const [selectedEpisode, setSelectedEpisode] = useState(null)

  const handleOpenCard = async (showId) => {
    setSelectedPodcastId(showId);
  };

  const handleGoBack = () => {
    setSelectedPodcastId(null);
  };

  const handleTogglefavourite = (singlePodcast, season, episode) => {
    const favouriteId = `${singlePodcast.id}-${season.season}-${episode.episode}`;

    if (favourites.some((episode) => episode.favouriteId === favouriteId)) {
      removeFavourite(favouriteId);
    } else {
      addFavourite(favouriteId);
    }
  };

  const addFavourite = (id) => {
    const timeAdded= new Date()
    const favouriteEpisode = {
      favouriteId: id,
      dateAdded: timeAdded,
    };
    const newFavouritesList = [...favourites, favouriteEpisode];
    setFavourites(newFavouritesList);
   // localStorage.setItem("favoriteEpisodes", JSON.stringify(newFavouritesList));
    console.log("added");
  };

  const removeFavourite = (id) => {
    const newFavouritesList = favourites.filter((favourite)=> favourite.favouriteId !== id)

    setFavourites(newFavouritesList);
   // localStorage.setItem("favoriteEpisodes", JSON.stringify(newFavouritesList));
    console.log("removed");
  };

  const handleFavNavigation = () => {
    setViewFavouritesPage((prevState) => !prevState);
  };

  const handleEpisode=(episode)=>{
    
    setSelectedEpisode(episode)
  }


  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Navbar handleFavNavigation={handleFavNavigation} />
        <Routes>
          <Route
            exact
            path="/"
            element={<PodcastPreview handleOpenCard={handleOpenCard} />}
          />
          {selectedPodcastId && (
            <Route
              exact
              path="/podcast/:id"
              element={
                <SinglePodcastDetails
                  podcastId={selectedPodcastId}
                  onGoBack={handleGoBack}
                  toggleFavourite={handleTogglefavourite}
                  playSelectedEpisode={handleEpisode}
                />
              }
            />
          )}
          {viewFavouritesPage && (
            <Route
              exact
              path="/favourites"
              element={
              <Favourites 
              FavouritesEpisodesLists={favourites} 
              toggleFavourite={handleTogglefavourite} 
              onGoBack={handleGoBack}
              playSelectedEpisode={handleEpisode}/>}
            />
          )}

          <Route exact path="/login" element={<Login />} />
        </Routes>
        <AudioPlayer EpisodeDetails={selectedEpisode}/>
      </BrowserRouter>
    </>
  );
}

export default App;


