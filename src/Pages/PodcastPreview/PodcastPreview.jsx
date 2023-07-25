import React, { useEffect, useState } from "react";
import "../PodcastPreview/PodcastPreview.css";
import Card from "../../components/Card/Card";
import { genres } from "../../utils/api";
 import Container from "@mui/material/Container";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Search from "../../components/SearchComponent/Search";
import SortFilter from "../../components/SortFilterComponent/SortFilter";
import GenreFilter from "../../components/GenreFilterComponent/GenreFilter";

export default function PodcastPreview({ handleOpenCard }) {
  //setting state for setting a selected podcast
  const [selectedPodcast, setSelectedPodcast] = useState(null);

  //setting state to set the number of shows to display
  const [numOfVisibleShows, setNumOfVisibleShows] = useState(9);

  //setting state for genre when selected
  const [selectedGenre, setSelectedGenre] = React.useState("");

  //set state for the podcast shows
  const [podcastShows, setPodcastShows] = useState([]);

  //set state for when the shows are loading
  const [loadingPodcasts, setLoadingPodcasts] = useState(true);

  // set state for when there is an error in fetching podcast shows

  const [isError, setIsError] = useState(false);

  // set state for search query
  const [query, setQuery] = useState("");

  //set state for sorted podcasts
  const [sortedPodcasts, setSortedPodcasts] = useState("");

  // Set initial search results to all podcasts
  const [searchResults, setSearchResults] = useState(podcastShows);

  const fetchPodcasts = async () => {
    try {
      const data = await fetch(`https://podcast-api.netlify.app/shows`);
      const result = await data.json();
      setPodcastShows(result);
      setLoadingPodcasts(false);
    } catch (error) {
      console.log(`ERROR ${error}`);
      setIsError(true);
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  // Handle initial search and set searchResults to all podcasts
  useEffect(() => {
    setSearchResults(podcastShows);
  }, [podcastShows]);

  function getGenreTitle(genreId) {
    if (genreId > 0 && genreId <= genres.length) {
      return genres[genreId - 1];
    }
    return "Unknown Genre";
  }

  const handleShow = (showId) => {
    handleOpenCard(showId);
    console.log(showId);
  };

  const filteredShowsByGenre = selectedGenre
    ? searchResults.filter((podcast) =>
        podcast.genres
          .map((genreId) => getGenreTitle(genreId))
          .includes(selectedGenre)
      )
    : searchResults;



  const sortPodcast = (order) => {
    setSortedPodcasts(order);

    const orderedShows = [...podcastShows];

    switch (order) {
      case "mostRecent":
        orderedShows.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
      case "leastRecent":
        orderedShows.sort((a, b) => new Date(a.updated) - new Date(b.updated));
        break;
      case "titleAZ":
        orderedShows.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "titleZA":
        orderedShows.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
    setPodcastShows(orderedShows);
  };

  const handleGoBack =() => {
    setSelectedPodcast(null)
  }

  //map over the shows
  const cards = filteredShowsByGenre.slice(0, numOfVisibleShows).map((show) => {
    const genreTitles = show.genres.map((genreId) => getGenreTitle(genreId));

    return (
      <Card
        key={show.id}
        item={show}
        genre={genreTitles}
        handleClick={handleShow}
      />
    );
  });

   const showMoreButton = numOfVisibleShows <= filteredShowsByGenre.length;
  return (
    <>
      <Container sx={{ mt: "6rem" }}>
         <>
           <div className="filters">
            <Search
              podcastShows={podcastShows}
              setSearchResults={setSearchResults}
            />

           <div className="filter--sort">
              <SortFilter sortPodcast={sortPodcast} />
            </div>
           </div>

           <GenreFilter
             selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
          />  

          <div className="shows-list">{cards}</div>

          {showMoreButton && (
            <Button
              sx={{ left: "45%", mt: "2rem", mb: "2rem" }}
              endIcon={<AddIcon />}
              size="large"
              color="secondary"
              variant="contained"
              onClick={() => setNumOfVisibleShows(numOfVisibleShows + 9)}
            >
              Show More
            </Button>
          )}
        </>
      </Container> 
    </>
  );
}
