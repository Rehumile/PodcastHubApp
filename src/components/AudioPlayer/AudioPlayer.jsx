
import { useState, useEffect, useRef } from "react";
import '../AudioPlayer/AudioPlayer.css'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { IconButton } from "@mui/material";

export default function AudioPlayer({EpisodeDetails}) {

//set state for when episode is playing
  const [isPlaying, setIsPlaying] = useState(false)

  //setting state to hold audio time
  const [timeProgress, setTimeProgress]=useState(0);
  const [duration, setDuration] = useState(0)

const currentEpisode = EpisodeDetails
const audioRef = useRef(null)
const progressBarRef=useRef()
const playAnimationRef = useRef();

useEffect(() => {
    if (currentEpisode) {
      audioRef.current.src = currentEpisode.file;
      audioRef.current.play();
      setIsPlaying(true)
     
    }
  }, [currentEpisode]);

  

//   const repeat = useCallback(() => {
//     const currentTime = audioRef.current.currentTime;
//     setTimeProgress(currentTime);
//     progressBarRef.current.value = currentTime;
//     progressBarRef.current.style.setProperty(
//       '--range-progress',
//       `${(progressBarRef.current.value / duration) * 100}%`
//     );

//     playAnimationRef.current = requestAnimationFrame(repeat);
//   }, [audioRef, duration, progressBarRef, setTimeProgress]);
  
// useEffect(() => {
//     if (isPlaying) {
//       audioRef.current.play();
//     } else {
//       audioRef.current.pause();
//     }
//     playAnimationRef.current = requestAnimationFrame(repeat);
//   }, [isPlaying, audioRef, repeat]);


// adding prompt to confirm whether user wants to leave even when audio is playing

useEffect(()=> {
  const audioElement = audioRef.current
  const handleBeforeUnload = (event) => {
    if (!audioElement.paused) {
      event.preventDefault()
      event.returnValue =''
      return ''
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => {
    window.addEventListener('beforeunload', handleBeforeUnload)
  };
}, []);




if(!currentEpisode) {
    return null
}



  const togglePlayPause = () => {
    if (audioRef.current) {
        if (audioRef.current.paused) {
          audioRef.current.play();
          setIsPlaying(true);
          
        } else {
          audioRef.current.pause();
          setIsPlaying(false);
          
        }
      }
      
  };

//   const togglePlayPause = () => {
//     setIsPlaying((prev) => !prev);
//   };


  const onLoadedMetadata =() => {
    const seconds = audioRef.current.duration
    setDuration(seconds)
    progressBarRef.current.max =seconds
  }

  
  const onPlaying = () => {
    const duration = audioRef.current.duration;
    const currentTime = audioRef.current.currentTime;
setTimeProgress(currentTime)
  }

  //function to be able to click on seek bar and it will go to specifc audio timeframe
  const checkWidth = (e)=>
  {
    let width = progressBarRef.current.clientWidth;
    const offset = e.nativeEvent.offsetX;

    const divprogress = offset / width * 100;
    audioRef.current.currentTime = divprogress / 100 * audioRef.current.duration;

  }
  
  // const handleProgressChange = () => {

  //   audioRef.current.currentTime = progressBarRef.current.value
  // };


  // to display time duration in minutes and seconds
  const formatTime = (time) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const formatMinutes =
        minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(time % 60);
      const formatSeconds =
        seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${formatMinutes}:${formatSeconds}`;
    }
    return '00:00';
  };


    return (
        <div className="audio--player">
            
                <audio id="audioPlayer" ref={audioRef} onLoadedMetadata={onLoadedMetadata} onTimeUpdate={onPlaying}/> 
            
             <div className="audio--info">
                <p className="episode--title"> Episode {currentEpisode.episode} - {currentEpisode.title}</p>
             </div>

                 <div className="progress">
               
          
            <div className="navigation--wrapper" ref={progressBarRef}>
             <div className='seek-bar'style={{width: `${(timeProgress/ duration) * 100}%`}}></div> 
            </div>
            <div className="time--progress">
                  <span className="time current">{formatTime(timeProgress)}</span>
            <span className="time">{formatTime(duration)}</span>
                </div> 
            
        </div>
                
         <div className="controls--wrapper">
            <div onClick={togglePlayPause}>
           <IconButton  sx={{fontSize: '2rem',color:'white'}}>
               {isPlaying ?<PlayArrowIcon fontSize="inherit" /> : <PauseIcon fontSize="inherit"/>  } 
            </IconButton>
            </div>

        </div> 
                 
             
          
        </div>
    )
}