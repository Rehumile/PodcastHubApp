import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
 import Navbar from "./components/NavbarComponent/Navbar";
import PodcastPreview from "./Pages/PodcastPreview/PodcastPreview";
 import Favourites from "./Pages/Favourites/Favourites";
import { SignUp, LoginUser } from "./components/Authentication";
import { getSavedLastPlayedEpisode } from "./utils/localStorage";
 import SinglePodcastDetails from "./components/SinglePodcastDetails/SinglePodcastDetails";
  import AudioPlayer from './components/AudioPlayer/AudioPlayer'
 import { useDispatch } from "react-redux";
 import { selectedEpisode } from "./features/AudioPlayer/playerSlice";
import { supabase } from "./supabaseClient";

function App() {
  //set state for store podcast ID of the selected shows
    const [selectedPodcastId, setSelectedPodcastId] = useState(null);

    // set state to store favourites
   const [favourites, setFavourites] = useState([]);

   //set state for when user views the Favourites Page
   const [viewFavouritesPage, setViewFavouritesPage] = useState(false);

   //set state for when user views the Login Page
   const [viewLoginPage, setViewLoginPage] = useState(false)

   // set state to store session when user is authenticated
   const [session, setSession] = useState(false)

  
  const dispatch = useDispatch();


  if(session) {
    sessionStorage.setItem('token', JSON.stringify(session))
  }
   
  // fetch session from session storage and set in state variable
  useEffect(() => {
    if(sessionStorage.getItem('session')) {
      let data = JSON.parse(sessionStorage.getItem('session'))
      setSession(data)
    }
  },[])

  // render the favourite episodes from database if user is logged in
  useEffect(() => {
    fetchFavouriteEpisodesFromDatabase()
  }, [session]);



  // retrieve the last played episode from local storage when app loads
  useEffect(()=> {
    const lastPlayedEpisode = getSavedLastPlayedEpisode();
    if(lastPlayedEpisode) {
      dispatch(selectedEpisode(lastPlayedEpisode))
    }
  },[])

 
/**
 * sets state to selected podcast
 * @param {Number} showId 
 */
  const handleOpenCard = async (showId) => {
    setSelectedPodcastId(showId);
  };

  /**
   * function to set state to null when user click the `Go Back` button
   */
  const handleGoBack = () => {
    setSelectedPodcastId(null);
  };

  /**
   * Function to add or remove favourites from the Supabase database
   * @param {Array} singlePodcast 
   * @param {Array} season 
   * @param {Object} episode 
   */
  const handleTogglefavourite = (singlePodcast, season, episode) => {
    const favouriteId = `${singlePodcast.id}-${season.season}-${episode.episode}`;
    if (favourites.some((episode) => episode.favouriteId === favouriteId)) {
      removeFavouriteFromDatabase(favouriteId)
    } else {
      addToFavouritesDatabase(favouriteId)
    }
  };


  /**
   * Async function the add favourite episode to supabase database. User should
   * authenticated to be able to add to favourites
   * @param {Number} favouriteEpisodeId 
   * @returns 
   */
  const addToFavouritesDatabase = async (favouriteEpisodeId) => {
    if (!session) {
      alert("User not authenticated. Please sign in to add favorites")
      return;
    }
    try {
      // created object reference to insert to database
      const favouriteEpisode = {
        favourite_id: favouriteEpisodeId,
        id: session.user.id,
        date_added: new Date(),
        
      }
      const {data, error} = await supabase
      .from('favourites')
      .insert([favouriteEpisode])
      if (error){
        alert('error saving episode to favourites.' ,error)
      } else {
        alert('episode is added to favourites', data)
        fetchFavouriteEpisodesFromDatabase()
      }
    } catch (error) {
      console.error('error saving to favourites', error.message)
    }
  }


  /**
   * Async function to remove favourites from supabase database
   * @param {Number} favouriteEpisodeId 
   */
  const removeFavouriteFromDatabase = async (favouriteEpisodeId) => {
    try {
      const {data, error} = await supabase
      .from('favourites')
      .delete()
      .eq('id', session.user.id) 
      .eq('favourite_id', favouriteEpisodeId)
      if (error) {
        alert('Error removing from favorites:', error);
      } else {
        alert('Episode removed from favorites:', data);
    fetchFavouriteEpisodesFromDatabase() 
      }
    } catch (error) {
      console.error('Error removing from favorites:', error.message);
    }
  } 

  /**
   * Async function to fetch favourite episodes from data
   * and set state variable to data provided
   * @returns 
   */
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
 

  /**
   * Function to toggle viewing of the favourites page
   */
  const handleFavNavigation = () => {
    setViewFavouritesPage((prevState) => !prevState);
  };

  /**
   * Function to toggle viewing of favourites page
   */
  const handleLoginNavigation = () => {
    setViewLoginPage((prevState) => !prevState);
  };

  /**
   * function to dispatch and set selected episode to played for audio player
   * @param {Object} episode 
   */
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


