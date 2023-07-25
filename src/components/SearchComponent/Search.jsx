
import { useState } from "react";
import Fuse from "fuse.js"

export default function Search({ podcastShows, setSearchResults}) {

    const [query, setQuery] = useState('')
     
      
      
      const handleSearch =(query) => {
const fuse = new Fuse(podcastShows, {
        keys: [
          'title'
        ]
      })

      const results = query ? fuse.search(query).map(result => result.item) : podcastShows
      setSearchResults(results)
     
      }

      useState(() => {
        if(query !== '') {
           handleSearch(query) 
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
        setQuery(e.target.value)
        handleSearch(e.target.value)
        }}
    />

  </form>
        </>
    )
}