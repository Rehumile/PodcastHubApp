import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../Carousel/Carousel.css";

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

export default function Carousel({ podcastShows, handleClick }) {
  return (
    <Slider {...carouselSettings} className="show--carousel">
      {podcastShows.slice(0, 8).map((show) => (
        <div
          key={show.id}
          className="carousel--slide"
          onClick={() => handleClick(show.id)}
        >
          <img className="carousel--image" src={show.image} alt={show.title} />
          <div className="show-details">
            <h3 className="show-title">{show.title}</h3>
            <p className="show-seasons">Seasons: {show.seasons}</p>
          </div>
        </div>
      ))}
    </Slider>
  );
}
