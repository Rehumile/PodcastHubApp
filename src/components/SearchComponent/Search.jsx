import { useState } from "react";
import Fuse from "fuse.js";
import "../SearchComponent/Search.css";

// eslint-disable-next-line react/prop-types
export default function Search({ podcastShows, setSearchResults }) {
  const [query, setQuery] = useState("");

  /**
   * function to search from podcasts based on the title. Perform a fuzzy match
   * and the state to the results
   * @param {String} query 
   */
  const handleSearch = (query) => {
    const fuse = new Fuse(podcastShows, {
      keys: ["title"],
    });

    const results = query
      ? fuse.search(query).map((result) => result.item)
      : podcastShows;
    setSearchResults(results);
  };

  useState(() => {
    if (query !== "") {
      handleSearch(query);
    }
  }, [query, podcastShows]);

  return (
    <>
      <form className="filter--search">
        <label>Search</label>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e.target.value);
          }}
        />
      </form>
    </>
  );
}
