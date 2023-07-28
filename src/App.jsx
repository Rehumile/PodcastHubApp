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
import { supabase } from "./supabaseClient";

function App() {
    const [selectedPodcastId, setSelectedPodcastId] = useState(null);
   const [favourites, setFavourites] = useState([]);
   const [viewFavouritesPage, setViewFavouritesPage] = useState(false);
   const [viewLoginPage, setViewLoginPage] = useState(false)

   const [session, setSession] = useState(false)
   const [user, setUser] = useState(null)

  
  const dispatch = useDispatch();


  if(session) {
    sessionStorage.setItem('token', JSON.stringify(session))
  }
   
  useEffect(() => {
    if(sessionStorage.getItem('session')) {
      let data = JSON.parse(sessionStorage.getItem('session'))
      setSession(data)
    }
  })

  // render the favourite episodes from database if user is logged in
  useEffect(() => {
    fetchFavouriteEpisodesFromDatabase()
  }, [session]);



  //retrieve the last played episode from local storage when app loads
  useEffect(()=> {
    const lastPlayedEpisode = getSavedLastPlayedEpisode();
    if(lastPlayedEpisode) {
      dispatch(selectedEpisode(lastPlayedEpisode))
    }
  },[])

 

  const handleOpenCard = async (showId) => {
    setSelectedPodcastId(showId);
  };

  const handleGoBack = () => {
    setSelectedPodcastId(null);
  };

  const handleTogglefavourite = (singlePodcast, season, episode) => {
    const favouriteId = `${singlePodcast.id}-${season.season}-${episode.episode}`;
    if (favourites.some((episode) => episode.favouriteId === favouriteId)) {
      removeFavouriteFromDatabase(favouriteId)
    } else {
      addToFavouritesDatabase(favouriteId)
    }
  };


  const addToFavouritesDatabase = async (favouriteEpisodeId) => {
    if (!session) {
      alert("User not authenticated")
      return;
    }
    try {
      const favouriteEpisode = {
        favourite_id: favouriteEpisodeId,
        id: session.user.id,
        date_added: new Date(),
        
      }
      const {data, error} = await supabase
      .from('favourites')
      .insert([favouriteEpisode])
      if (error){
        console.error('error saving episode to favourites.' ,error)
      } else {
        console.log('episode is added to favourites', data)
        fetchFavouriteEpisodesFromDatabase()
      }
    } catch (error) {
      console.error('error saving to favourites', error.message)
    }
  }


  const removeFavouriteFromDatabase = async (favouriteEpisodeId) => {
    try {
      const {data, error} = await supabase
      .from('favourites')
      .delete()
      .eq('id', session.user.id) 
      .eq('favourite_id', favouriteEpisodeId)
      if (error) {
        console.error('Error removing from favorites:', error);
      } else {
        console.log('Episode removed from favorites:', data);
    fetchFavouriteEpisodesFromDatabase() 
      }
    } catch (error) {
      console.error('Error removing from favorites:', error.message);
    }
  } 

  const fetchFavouriteEpisodesFromDatabase = async () => {
    if (!session) return; 

      const { data, error } = await supabase
        .from('favourites')
        .select('*')
        .eq('id', session.user.id); 

      if (error) {
        console.log('error fetching episodes', error)
      } else {
        setFavourites(data)
      }
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
    <p>test</p>
     <BrowserRouter>
     <Navbar 
      handleFavNavigation={handleFavNavigation}
     handleLoginNavigation={handleLoginNavigation} />
    <Routes>
       <Route
            exact
            path="/"
            element={<PodcastPreview handleOpenCard={handleOpenCard} session={session}/>}
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
                  databaseEpisodes = {fetchFavouriteEpisodesFromDatabase()}
                />
              }
            />
          )} 
          
            <Route
              exact
              path="/favourites"
              element={
              <Favourites 
              FavouritesEpisodesLists={favourites} 
              toggleFavourite={handleTogglefavourite} 
              onGoBack={handleGoBack}
              playSelectedEpisode={handleEpisode}
              session={session}
              />}
            />
        

   <Route exact path="/signup" element={<SignUp/>} />  
   <Route exact path="/login" element={<LoginUser setSession={setSession}/>} />  
        
     </Routes>
<AudioPlayer/>

     </BrowserRouter> 
     
    </> 
  );
}

export default App;


