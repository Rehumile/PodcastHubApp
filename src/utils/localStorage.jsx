export const getSavedLastPlayedEpisode = ()=> {
    const lastPlayedEpisodeString = localStorage.getItem("lastPlayedEpisode")
    if (lastPlayedEpisodeString) {
        try {
            const lastPlayedEpisode = JSON.parse(lastPlayedEpisodeString);
            return lastPlayedEpisode
        } catch (error) {
            console.error("Error parsing last played episode from local storage")
        }
    }
}