import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import './index.css'
import { ThemeProvider } from '@mui/material/styles'
import theme from './utils/theme.jsx'
import {store} from './app/store.jsx'
import {Provider} from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
  <Provider store={store}>
    <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
  </Provider>
  </>,
)
