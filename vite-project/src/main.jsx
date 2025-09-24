import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import getTheme, { ThemeModeContext } from './theme.js'
import './index.css'

function Root() {
  const [mode, setMode] = React.useState('light')
  const theme = React.useMemo(() => getTheme(mode), [mode])
  const toggle = React.useCallback(() => setMode((m) => (m === 'light' ? 'dark' : 'light')), [])

  return (
    <React.StrictMode>
      <ThemeModeContext.Provider value={{ mode, toggle }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </ThemeModeContext.Provider>
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)
