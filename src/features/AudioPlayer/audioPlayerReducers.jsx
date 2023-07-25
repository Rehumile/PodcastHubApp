import { combineReducers } from "@reduxjs/toolkit";
import audioPlayerReducer from './playerSlice'

const rootReducer = combineReducers({
    audioPlayer: audioPlayerReducer
});

export default rootReducer