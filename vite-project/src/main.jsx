import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import getTheme, { ThemeModeContext } from './theme.js'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

import AdminDashboard from "./pages/AdminDashboard.jsx";
import FacultyDashboard from "./pages/FacultyDashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Root() {
  const [mode, setMode] = React.useState('light')
  const theme = React.useMemo(() => getTheme(mode), [mode])
  const toggle = React.useCallback(() => setMode((m) => (m === 'light' ? 'dark' : 'light')), [])

  return (
    <React.StrictMode>
      <ThemeModeContext.Provider value={{ mode, toggle }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
            </Routes>
          </BrowserRouter>

          {/* ToastContainer added*/}
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />

        </ThemeProvider>
      </ThemeModeContext.Provider>
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)
