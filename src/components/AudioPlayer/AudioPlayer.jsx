import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import "../AudioPlayer/AudioPlayer.css";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AudioPlayer() {
  //set state for when episode is playing
  const [isPlaying, setIsPlaying] = useState(false);

  //setting state to hold audio time
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  //set state to track episode progress
  const [episodeProgress, setEpisodeProgress] = useState({});

  //set state to close audio player
  const [closePlayer, setClosePlayer] = useState(false);

  //set state for completed episodes
  const [completedEpisodes, setCompletedEpisodes] = useState(() => {
    const storedCompletedEpisodes = localStorage.getItem("completedEpisodes");
    return storedCompletedEpisodes ? JSON.parse(storedCompletedEpisodes) : [];
  });

  // fetch episode from the redux store
  const currentEpisode = useSelector(
    (state) => state.audioPlayer.selectedEpisode
  );

  const audioRef = useRef(null);
  const progressBarRef = useRef();

  // Load the last played episode from local storage when the component mounts
  useEffect(() => {
    if (currentEpisode) {
      audioRef.current.src = currentEpisode.file;
      audioRef.current.play();
      setIsPlaying(true);
      setClosePlayer(false)
      // save the last played episode to local storage
      localStorage.setItem("lastPlayedEpisode", JSON.stringify(currentEpisode));
    }
  }, [currentEpisode]);

  useEffect(() => {
    // Retrieve episode progress from local storage
    const lastPlayedProgress = JSON.parse(
      localStorage.getItem("lastPlayedProgress")
    );

    // Set the progress state with the retrieved data
    if (lastPlayedProgress) {
      setEpisodeProgress(lastPlayedProgress);
    }
  }, []);

  // 

  /**
   * Function within a useEffect to handle adding a prompt 
   * to confirm whether user wants to leave even when audio is playing
   */
  useEffect(() => {
    const audioElement = audioRef.current;
    const handleBeforeUnload = (event) => {
      if (!audioElement.paused) {
        event.preventDefault();
        event.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.addEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  
  /**
   * function to update progress of current episode
   * @param {Number} episodeId 
   * @param {Number} progress 
   */
  const updateProgress = (episodeId, progress) => {
    setEpisodeProgress((prevProgress) => ({
      ...prevProgress,
      [episodeId]: progress,
    }));
  };

  if (!currentEpisode) {
     // Return null if there is no current episode selected
    return null;
  }

  /**
   * function handle play and pause states if user is playing audio
   * the episode will updated to track the time
   */
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);

        if (currentEpisode) {
          updateProgress(currentEpisode.episode, audioRef.current.currentTime);
        }
      }
    }
  };

  /**
   * // Function to handle the "loadedmetadata" event of the audio element
   */
  const onLoadedMetadata = () => {
    const seconds = audioRef.current.duration;
    setDuration(seconds);
    progressBarRef.current.max = seconds;
  };

  /**
   * Function to set the time progress as user is playing audio and update the progress
   */
  const onPlaying = () => {
    const currentTime = audioRef.current.currentTime;
    setTimeProgress(currentTime);

    if (currentEpisode) {
      updateProgress(currentEpisode.episode, currentTime);
    }
  };

 
 
  /**
   * Function to be able to click on the seek bar
   * and seek to a specific audio timeframe
   * @param {Object} e 
   */
  const clickSeekBar = (e) => {
    const progressBarWidth = progressBarRef.current.clientWidth;
    const offsetX = e.nativeEvent.offsetX;
    const progressPercent = (offsetX / progressBarWidth) * 100;
    const audioDuration = audioRef.current.duration;
    const newCurrentTime = (progressPercent / 100) * audioDuration;
    audioRef.current.currentTime = newCurrentTime;
  };

  /**
   * Function to save the last played progress of the current episode 
   * to local storage
   */
  const saveLastPlayedProgress = () => {
    if (currentEpisode) {
      const currentTime = audioRef.current.currentTime;
      updateProgress(currentEpisode.episode, currentTime);
      localStorage.setItem(
        "lastPlayedProgress",
        JSON.stringify(episodeProgress)
      );
    }
  };

  /**
   * Function that handles the closing of the audio player
   */
  const handleCloseAudioPlayer = () => {
    audioRef.current.pause();
    setIsPlaying(false);
    setClosePlayer(true);
    
    if (currentEpisode) {
      // Save the last played progress and episode to local storage 
      updateProgress(currentEpisode.episode, audioRef.current.currentTime);
      localStorage.setItem("lastPlayedEpisode", JSON.stringify(currentEpisode));

      // Update completed episodes list and save it to local storage
      if (!completedEpisodes.includes(currentEpisode.title)) {
        setCompletedEpisodes([...completedEpisodes, currentEpisode.title]);
        localStorage.setItem(
          "completedEpisodes",
          JSON.stringify(completedEpisodes)
        );
      }
    }

    saveLastPlayedProgress();
  };

  // Function to reset all progress, effectively removing listening history
  const resetProgress = () => {
    localStorage.removeItem("lastPlayedEpisode");
    localStorage.removeItem("completedEpisodes");
    localStorage.removeItem("lastPlayedProgress");
    setCompletedEpisodes([]);
    setEpisodeProgress({});
   
   
  };


  /**
   * Function to display time duration in minutes and seconds
   * @param {Number} time 
   * @returns 
   */
  const formatTime = (time) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(time % 60);
      const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${formatMinutes}:${formatSeconds}`;
    }
    return "00:00";
  };

  return (
    <div className={closePlayer ? "audio--player-close" :"audio--player"}>
      <div >
        <div className="close--reset">
          {/* <IconButton sx={{ fontSize: "0.5rem", color: "white" }}>
            <CloseIcon />
          </IconButton> */}
          <i className="uil uil-times close--button" onClick={handleCloseAudioPlayer} ></i>
          <button className="reset" onClick={() => resetProgress()}>
            Reset
          </button>
        </div>
      </div>
      <audio
        id="audioPlayer"
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onPlaying}
        currentTime={episodeProgress[currentEpisode?.id] || 0}
      />

      <div className="audio--info">
        <p className="episode--title">
          {" "}
          Episode {currentEpisode.episode} - {currentEpisode.title}
        </p>
      </div>

      <div className="progress">
        <div className="navigation--wrapper" ref={progressBarRef}>
          <div
            className="seek-bar"
            style={{ width: `${(timeProgress / duration) * 100}%` }}
            onClick={clickSeekBar}
          ></div>
        </div>
        <div className="time--progress">
          <span className="time current">{formatTime(timeProgress)}</span>
          <span className="time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="controls--wrapper">
        <div onClick={togglePlayPause}>
          <IconButton sx={{ fontSize: "2rem", color: "white" }}>
            {isPlaying ? (
              <PlayArrowIcon fontSize="inherit" />
            ) : (
              <PauseIcon fontSize="inherit" />
            )}
          </IconButton>
        </div>
      </div>
    </div>
  );
}
