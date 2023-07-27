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
import { ColorRing } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import Carousel from "../../components/Carousel/Carousel";
import Slider from "react-slick";


export default function PodcastPreview({ handleOpenCard, session }) {
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

  // set state load more podcast shows
  const [loadingMoreShows, setLoadingMoreShows] = useState(false);

  // set state for when there is an error in fetching podcast shows

  const [isError, setIsError] = useState(false);

  // set state for search query
  const [query, setQuery] = useState("");

  //set state for sorted podcasts
  const [sortedPodcasts, setSortedPodcasts] = useState("");

  // Set initial search results to all podcasts
  const [searchResults, setSearchResults] = useState(podcastShows);

  // State for Carousel shows
  const [carouselShows, setCarouselShows] = useState([]);

  const navigate = useNavigate();

  const fetchPodcasts = async () => {
    try {
      const data = await fetch(`https://podcast-api.netlify.app/shows`);
      const result = await data.json();
      setPodcastShows(result);
      setLoadingPodcasts(false);
    } catch (error) {
      console.log(`ERROR ${error}`);
      setIsError(true);
      setLoadingPodcasts(false);
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  // Handle initial search and set searchResults to all podcasts
  useEffect(() => {
    setSearchResults(podcastShows);
  }, [podcastShows]);

  // useEffect(() => {
  //   const filteredShows = podcastShows.filter(
  //     (show) =>
  //       show.title.toLowerCase().includes(query.toLowerCase()) &&
  //       !carouselShows.find((carouselShow) => carouselShow.id === show.id)
  //   );
  
  //   // Shuffle the filtered shows array
  //   const shuffledShows = filteredShows.sort(() => 0.5 - Math.random());
  
  //   setCarouselShows(shuffledShows.slice(0, numOfVisibleShows));
  // }, [podcastShows, query, numOfVisibleShows]);

  function shuffleArray(array) {
    // Create a copy of the original array
    const shuffledArray = [...array];
  
    // Perform a Fisher-Yates (Knuth) shuffle to randomize the order
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
  
    return shuffledArray;
  }

  if (loadingPodcasts) {
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

  function getGenreTitle(genreId) {
    if (genreId > 0 && genreId <= genres.length) {
      return genres[genreId - 1];
    }
    return "Unknown Genre";
  }

  const handleShow = (showId) => {
    handleOpenCard(showId);
    console.log(showId);

    setCarouselShows((prevCarouselShows) =>
      prevCarouselShows.filter((show) => show.id !== showId)
    );
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

  const handleGoBack = () => {
    setSelectedPodcast(null);
  };

  //this function will log user out of their account. remove token from session storage
  // and navigate back to login page
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  const handleLoadMoreShows = () => {
    setLoadingMoreShows(true);
    try {
      setNumOfVisibleShows((prevVisibleShows) => prevVisibleShows + 9);
      setLoadingPodcasts(false);
    } catch (error) {
      console.error(
        "There was an issue fetching more shows. Try Refreshing Page",
        error
      );
    }
    setLoadingMoreShows(false);
  };

  let shuffledPodcasts = shuffleArray(filteredShowsByGenre);
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

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const showMoreButton = numOfVisibleShows <= filteredShowsByGenre.length;
  return (
    <>
      {/**<h1>Welcome Back, {session.user.user_metadata.full_name || }</h1>  */}
      {/* <button onClick={handleLogout}>Logout</button> */}
      {/* <Carousel handleOpenCard={handleOpenCard} podcastShows={shuffledPodcasts}/> */}
      {/* <Slider {...carouselSettings} className="show-carousel">
      {podcastShows.slice(0, 8).map((show) => (
        <div key={show.id} className="carousel-slide" onClick={handleOpenCard}>
          <img className="carousel-image" src={show.image} alt={show.title} />
          <div className="show-details">
            <h3 className="show-title">{show.title}</h3>
            <p className="show-seasons">Seasons: {show.seasons}</p>
          </div>
        </div>
      ))}
    </Slider> */}
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
          {loadingMoreShows ? (
            <div className="loading--icon">
              <ColorRing
                visible={true}
                height="80"
                width="80"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                colors={["#003EAB", "#008033", "#EEF3F6", "#003EAB", "#008033"]}
              />
            </div>
          ) : (
            showMoreButton && (
              <Button
                sx={{ left: "45%", mt: "2rem", mb: "2rem" }}
                endIcon={<AddIcon />}
                size="large"
                color="secondary"
                variant="contained"
                onClick={handleLoadMoreShows}
              >
                Show More
              </Button>
            )
          )}
        </>
      </Container>
    </>
  );
}
