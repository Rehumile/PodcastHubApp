import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "./components/NavbarComponent/Navbar";
import PodcastPreview from "./Pages/PodcastPreview/PodcastPreview";
 import Favourites from "./Pages/Favourites/Favourites";
import { SignUp, LoginUser } from "./components/Authentication";
import { getSavedLastPlayedEpisode } from "./utils/localStorage";

// import Login from "./Pages/Login/Login";
 import SinglePodcastDetails from "./components/SinglePodcastDetails/SInglePodcastDetails";
  import AudioPlayer from './components/AudioPlayer/AudioPlayer'
 import { useDispatch } from "react-redux";
 import { selectedEpisode } from "./features/AudioPlayer/playerSlice";

function App() {
    const [selectedPodcastId, setSelectedPodcastId] = useState(null);
   const [favourites, setFavourites] = useState([]);
   const [viewFavouritesPage, setViewFavouritesPage] = useState(false);
   const [viewLoginPage, setViewLoginPage] = useState(false)

   const [token, setToken] = useState(false)

  //set state for selected episode to be played
  // const [selectedEpisode, setSelectedEpisode] = useState(null)

  
  const dispatch = useDispatch();


  if(token) {
    sessionStorage.setItem('token', JSON.stringify(token))
  }
   
  // useEffect(() => {
  //   if(sessionStorage.getItem('token')) {
  //     let data = JSON.parse(sessionStorage.getItem('token'))
  //     setToken(data)
  //   }
  // })

  //*****retrieve the last played episode from local storage when app loads
  // useEffect(()=> {
  //   const lastPlayedEpisode = getSavedLastPlayedEpisode();
  //   if(lastPlayedEpisode) {
  //     dispatch(selectedEpisode(lastPlayedEpisode))
  //   }
  // },[])

  const handleOpenCard = async (showId) => {
    setSelectedPodcastId(showId);
  };

  const handleGoBack = () => {
    setSelectedPodcastId(null);
  };

  const handleTogglefavourite = (singlePodcast, season, episode) => {
    const favouriteId = `${singlePodcast.id}-${season.season}-${episode.episode}`;
//if user has not signed --> direct to sign in page 
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
    // add data to supabase
  };

  const removeFavourite = (id) => {
    const newFavouritesList = favourites.filter((favourite)=> favourite.favouriteId !== id)

    setFavourites(newFavouritesList);
   // localStorage.setItem("favoriteEpisodes", JSON.stringify(newFavouritesList));
    console.log("removed");

    // remove data from supabase
  };

  const handleFavNavigation = () => {
    setViewFavouritesPage((prevState) => !prevState);
  };
  const handleLoginNavigation = () => {
    setViewLoginPage((prevState) => !prevState);
  };



  const handleEpisode=(episode)=>{
    dispatch(selectedEpisode(episode))
  }


  return (
    <>
    <p>hello</p>
     <BrowserRouter>
     <Navbar 
     handleFavNavigation={handleFavNavigation}
     handleLoginNavigation={handleLoginNavigation} />
     <Routes>
      {/*this states if the token is true then the user will be granted access to podcast previews */}
      {/*{token && <Route
            exact
            path="/"
            element={<PodcastPreview handleOpenCard={handleOpenCard} token={token}/>}
          />} */}
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

   <Route exact path="/signup" element={<SignUp/>} />  
   <Route exact path="/login" element={<LoginUser setToken={setToken}/>} />  
        
     </Routes>
<AudioPlayer/>

     </BrowserRouter> 
      {/*
        
        <h1>Hello</h1>
         
          <Route
            exact
            path="/"
            element={<PodcastPreview handleOpenCard={handleOpenCard} />}
          />
          
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
      </BrowserRouter>*/}
     
    </>
  );
}

export default App;


