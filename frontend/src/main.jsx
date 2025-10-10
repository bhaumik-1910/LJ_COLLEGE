import React, { useCallback, useContext, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import getTheme, { ThemeModeContext } from './theme.js'
import { AuthProvider, AuthContext } from './context/AuthContext.jsx'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

import FacultyDashboard from "./pages/Faculty/Dashboard.jsx";
import AdminDashboard from './pages/Admin/Dashboard.jsx'
import { SidebarProvider } from './context/Admin/sidebarContext.jsx'
import AdminLayout from './layout/Admin/AdminLayout.jsx'
import U_Register from './pages/Admin/U_Register.jsx'
import AdminUsers from './pages/Admin/Users.jsx'
import UniversityUsers from './pages/Admin/University_Users.jsx'
import AdminList from './pages/Admin/Admin_List.jsx'
import AdminProfile from './pages/Admin/Profile.jsx'

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from './routes/PrivateRoute.jsx'
import PublicRoute from './routes/PublicRoute.jsx'
import Forget from './pages/Forget.jsx'
import FacultyLayout from './layout/Faculty/FacultyLayout.jsx'
import Add_Student from './pages/Faculty/Add_Student.jsx'
import Student_List from './pages/Faculty/Student_List.jsx'
import FacultyProfile from './pages/Faculty/Profile.jsx'
import Add_document from './pages/Faculty/Add_document.jsx'
import Document_list from './pages/Faculty/Document_list.jsx'
import All_Document from './pages/Admin/All_Document.jsx'

function Root() {
  const [mode, setMode] = useState('light')
  const theme = useMemo(() => getTheme(mode), [mode])
  const toggle = useCallback(() => setMode((m) => (m === 'light' ? 'dark' : 'light')), [])

  const { token } = useContext(AuthContext);
  const isLoggedIn = !!token;

  return (
    <React.StrictMode>
      <ThemeModeContext.Provider value={{ mode, toggle }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<App />} />
                {/* Public auth routes */}
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                {/* <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} /> */}
                <Route path="/forgot" element={<PublicRoute><Forget /></PublicRoute>} />

                {/* Admin area: nested under /admin-dashboard/* with Outlet in AdminLayout */}
                <Route
                  path="/admin-dashboard"
                  element={
                    <PrivateRoute role="admin" isLoggedIn={isLoggedIn}>
                      <SidebarProvider>
                        <AdminLayout />
                      </SidebarProvider>
                    </PrivateRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="register" element={<Register />} />
                  <Route path="university-register" element={<U_Register />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="university-users" element={<UniversityUsers />} />
                  <Route path="document" element={<All_Document />} />
                  <Route path="admins" element={<AdminList />} />
                  <Route path="profile" element={<AdminProfile />} />
                </Route>

                {/* Faculty dashboards */}
                <Route
                  path="/faculty-dashboard"
                  element={
                    <PrivateRoute role="faculty" isLoggedIn={isLoggedIn}>
                      <SidebarProvider>
                        <FacultyLayout />
                      </SidebarProvider>
                    </PrivateRoute>
                  }
                >
                  <Route index element={<FacultyDashboard />} />
                  <Route path="add-student" element={<Add_Student />} />
                  <Route path="add-document" element={<Add_document />} />
                  <Route path="student-list" element={<Student_List />} />
                  <Route path="document-list" element={<Document_list />} />
                  <Route path="profile" element={<FacultyProfile />} />
                </Route>

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
          </AuthProvider>
        </ThemeProvider>
      </ThemeModeContext.Provider>
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)
