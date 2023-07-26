import react from 'React'
import { useState, useEffect } from 'React'
import { Container } from '@mui/material'
import '../Favourites/Favourites.css'
import { Link } from 'react-router-dom'
import GoBack from '../../components/GoBack/GoBack'
import { changeDateFormat } from '../../utils/helperFunctions'
import { getDateAndTime } from '../../utils/helperFunctions'
import IconButton from "@mui/material/IconButton";
import SmartDisplayOutlinedIcon from "@mui/icons-material/SmartDisplayOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SortFilter from '../../components/SortFilterComponent/SortFilter'
import { ColorRing } from 'react-loader-spinner'
import { supabase } from '../../supabaseClient'


//if user has not signed in --> show message sign in to view your favourites
// if user has signed in --> fetch fav episodes from supabase database and render to page

export default function Favourites({FavouritesEpisodesLists, toggleFavourite, onGoBack, playSelectedEpisode, session}) {
    const [favouriteEpisodes ,setFavouriteEpisodes] = useState([])

    // set state for loading favourite episodes
  const [loadingDetails, setLoadingDetails] = useState(true);

  // set state for when there is an error in fetching single podcast show
  const [isError, setIsError] = useState(false);

  //set state for sorted podcasts
  const [sortedPodcasts, setSortedPodcasts] = useState("");

  // if (!session) {
  //   return (
  //     <h1> Head to login page or signup to get access to favourites</h1>
  //   )
  // }

   // Fetch favorite episodes data from the composite key that is saved in favorites. Made from show ID, season number and episode number
   useEffect(() => {
    const fetchFavoriteEpisodes = async () => {
      const episodes = [];

      // Loop through composite keys in favorites array
      for (let episode of FavouritesEpisodesLists) {

        const [podcastId,seasonNum ,episodeNum ] = episode.favouriteId.split('-') 

        // Fetch and store show data in state
        try {
          const response = await fetch(
            `https://podcast-api.netlify.app/id/${podcastId}`
          );
          const data = await response.json();
          const seasonData = data.seasons.find(
            (season) => season.season === parseInt(seasonNum)
          );

          // Build object for favorite data
          const favObject = {
            ID : episode.favouriteId,
            show: data,
            season: seasonData,
            episode: seasonData.episodes.find(
              (episode) => episode.episode === parseInt(episodeNum)
            ),
            dateAdded: episode.dateAdded
          };

          episodes.push(favObject);
          setLoadingDetails(false)
        } catch (error) {
          console.error(
            "Issue fetching this show's details. Please try again.",
            error
          );
        }
      }
      setFavouriteEpisodes(episodes);
    };

    fetchFavoriteEpisodes();
  }, [FavouritesEpisodesLists]);

  const fetchFavouriteEpisodesFromDatabase = async () => {
    if (!session) return  <h1> Head to login page or signup to get access to favourites</h1>

    try {
      const {data, error} = await supabase
      .from('favourite_episodes')
      .select('*')
      .eq('id', session.user.id)
      if (error) {
        console.error('Error fetching favorite episodes:', error);
      } else {
        console.log(data)
      //   const episodes = [];

      // // Loop through composite keys in favorites array
      // for (let episode of FavouritesEpisodesLists) {

      //   const [podcastId,seasonNum ,episodeNum ] = episode.favouriteId.split('-') 

      //   // Fetch and store show data in state
      //   try {
      //     const response = await fetch(
      //       `https://podcast-api.netlify.app/id/${podcastId}`
      //     );
      //     const data = await response.json();
      //     const seasonData = data.seasons.find(
      //       (season) => season.season === parseInt(seasonNum)
      //     );

      //     // Build object for favorite data
      //     const favObject = {
      //       ID : episode.favouriteId,
      //       show: data,
      //       season: seasonData,
      //       episode: seasonData.episodes.find(
      //         (episode) => episode.episode === parseInt(episodeNum)
      //       ),
      //       dateAdded: episode.dateAdded
      //     };

      //     episodes.push(favObject);
      //     setLoadingDetails(false)
      //   } catch (error) {
      //     console.error(
      //       "Issue fetching this show's details. Please try again.",
      //       error
      //     );
      //   }
      // }
      // setFavouriteEpisodes(episodes);
    
      }
    } catch (error) {
      console.error('Error fetching favorite episodes:', error.message);
    }
  }

  const sortPodcast = (order) => {
    setSortedPodcasts(order);

    const orderedShows = [...favouriteEpisodes];

    switch (order) {
      case "mostRecent":
        orderedShows.sort((a, b) => new Date(b.show.updated) - new Date(a.show.updated));
        break;
      case "leastRecent":
        orderedShows.sort((a, b) => new Date(a.show.updated) - new Date(b.show.updated));
        break;
      case "titleAZ":
        orderedShows.sort((a, b) => a.show.title.localeCompare(b.show.title));
        break;
      case "titleZA":
        orderedShows.sort((a, b) => b.show.title.localeCompare(a.show.title));
        break;
    }
    setFavouriteEpisodes(orderedShows);
  };

//   if (loadingDetails) {
//     return (
//       <div className="loading--icon">
//            <ColorRing
//       visible={true}
//       height="150"
//       width="150"
//       ariaLabel="blocks-loading"
//       wrapperStyle={{}}
//      wrapperClass="blocks-wrapper"
//        colors={['#003EAB', '#008033','#EEF3F6','#003EAB', '#008033']}
//      />  
// </div>
//     )
//   }
  
if (!favouriteEpisodes) {
  return (
    <h1>Havent added any episodes yet. Go discover Podcasts to listen to in Home Page !</h1>
  )
}


 
    return (
     
        <Container>
            <Link to='/'>
     <GoBack onGoBack={onGoBack}/></Link> 
     {session && <p>Here are your favourites, {session.user.user_metadata.full_name}</p>}
    
        
            <h1 className='heading'>Favourites</h1>
            {favouriteEpisodes.map((episode) => (

                <>
                <SortFilter sortPodcast={sortPodcast}/>
              
                <div key={episode.ID} className='fav--episode'>
                    <img className='fav--image' src={episode.show.image}/>
                    <div className='fav--details'>
                <h4>Podcast: {episode.show.title}</h4>
                 <div onClick={()=>(toggleFavourite(episode.show, episode.season, episode.episode))}>
                    <IconButton
                      sx={{
                        mr: "3rem",
                        color: "red",
                      }}
                      aria-label="favoourite"
                      size="large"
                      
                      
                    >
                      <FavoriteIcon fontSize="inherit" />
                    </IconButton>
                  </div>     
            <p key={episode.ID} >Episode {episode.episode.episode}: {episode.episode.title}</p>
                <p>{episode.episode.description}</p>
                <p>Last Updated: {changeDateFormat(episode.show.updated)}</p>
                <p>Added to Favourites: {getDateAndTime(episode.dateAdded)} </p>
 </div>
 <div onClick={()=>playSelectedEpisode(episode.episode)} className="play--button">
                  <IconButton
                    aria-label="playbutton"
                    size="large"
                    sx={{ color: "#008033", fontSize: "5.5rem" }}
                  >
                     <SmartDisplayOutlinedIcon fontSize="inherit" /> 
                  </IconButton> 
                </div>
 </div>
 </>
           ) )}
           
        
       </Container> 
    )
    
}