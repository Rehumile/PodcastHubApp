/* eslint-disable react/prop-types */
import "../Card/Card.css";
import { Link } from "react-router-dom";
import { changeDateFormat } from "../../utils/helperFunctions";

export default function Card(props) {
  
  /**
   * function to seperate the genres on the page(eg. Action, True Crime, Fantasy)
   *
   */
  const concatenatedGenres = props.genre.reduce((accumulator, currentGenre) => {
    if (accumulator === "") {
      return currentGenre;
    } else {
      return accumulator + ", " + currentGenre;
    }
  }, "");

  return (
    <>
      <Link
        style={{ textDecoration: "none", color: "#000" }}
        to={`podcast/${props.item.id}`}
      >
        <div
          onClick={() => props.handleClick(props.item.id)}
          key={props.item.id}
          className="podcast"
        >
          <img src={props.item.image} className="podcast--image" />
          <h3 className="podcast--title">{props.item.title}</h3>
          <div className="info--container">
            <p className="podcast--seasons">Seasons: {props.item.seasons}</p>
            <p className="podcast--date">
              Last Update: {changeDateFormat(props.item.updated)}
            </p>
            <p className="podcast--genres">{concatenatedGenres}</p>
          </div>
        </div>
      </Link>
    </>
  );
}
