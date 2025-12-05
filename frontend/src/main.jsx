import React, { useCallback, useContext, useMemo, useState } from 'react'
import './index.css'
import App from './App.jsx'
import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import getTheme, { ThemeModeContext } from './theme.js'
import { ThemeProvider } from '@mui/material/styles'
import { AuthProvider, AuthContext } from './context/AuthContext.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { SidebarProvider } from './context/SuperAdmin/sidebarContext.jsx'

import SuperAdminLayout from './layout/SuperAdmin/SuperAdminLayout.jsx'
import AdminLayout from './layout/Admin/AdminLayout.jsx'
import FacultyLayout from './layout/Faculty/FacultyLayout.jsx'

import PrivateRoute from './routes/PrivateRoute.jsx'
import PublicRoute from './routes/PublicRoute.jsx'

import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Forget from './pages/Forget.jsx'

import SuperAdminDashboard from './pages/SuperAdmin/Dashboard.jsx'
import SuperU_Register from './pages/SuperAdmin/U_Register.jsx'
import SuperUniversityUsers from './pages/SuperAdmin/University_Users.jsx'
import SuperAdminProfile from './pages/SuperAdmin/Profile.jsx'
import SuperAll_Document from './pages/SuperAdmin/All_Document.jsx'
import SuperAdminList from './pages/SuperAdmin/Super_Admin_List.jsx'
import AdminList from './pages/SuperAdmin/Admin_List.jsx'
import Admin_Faculty from './pages/SuperAdmin/Faculty_List.jsx'

import FacultyDashboard from "./pages/Faculty/Dashboard.jsx";
import Add_Student from './pages/Faculty/Add_Student.jsx'
import Student_List from './pages/Faculty/Student_List.jsx'
import FacultyProfile from './pages/Faculty/Profile.jsx'
import Add_document from './pages/Faculty/Add_document.jsx'
import Document_list from './pages/Faculty/Document_list.jsx'

import AdminDashboard from './pages/Admin/Dashboard.jsx'
import AdminStudentList from './pages/Admin/Student_List.jsx'
import AdminDocumentList from './pages/Admin/Document_List.jsx'
import AdminProfile from './pages/Admin/Profile.jsx'
import AdminFacultyList from './pages/Admin/Faculty_List.jsx'
import University_Institute from './pages/SuperAdmin/University_Institute.jsx'
import InstitutionList from './pages/SuperAdmin/Institution_List.jsx'
import UniversityList from './pages/SuperAdmin/University_List.jsx'

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

                {/* Super Admin area: nested under /superadmin-dashboard/* with Outlet in Super AdminLayout */}
                <Route
                  path="/superadmin-dashboard"
                  element={
                    <PrivateRoute role="superadmin" isLoggedIn={isLoggedIn}>
                      <SidebarProvider>
                        <SuperAdminLayout />
                      </SidebarProvider>
                    </PrivateRoute>
                  }
                >
                  <Route index element={<SuperAdminDashboard />} />
                  <Route path="university-register" element={<SuperU_Register />} />
                  <Route path="register" element={<Register />} />
                  <Route path="university-list" element={<UniversityList />} />
                  <Route path="university-users" element={<SuperUniversityUsers />} />
                  <Route path="institution" element={<University_Institute />} />
                  <Route path="institution-list" element={<InstitutionList />} />
                  <Route path="document" element={<SuperAll_Document />} />
                  <Route path="superadmin" element={<SuperAdminList />} />
                  <Route path="admins" element={<AdminList />} />
                  <Route path="faculty" element={<Admin_Faculty />} />
                  <Route path="profile" element={<SuperAdminProfile />} />
                </Route>

                {/* Admin area: nested under /admin-dashboard/* with Outlet in adminLayout */}
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
                  <Route path="add-faculty" element={<Register />} />
                  <Route path="student-list" element={<AdminStudentList />} />
                  <Route path="document-list" element={<AdminDocumentList />} />
                  <Route path="faculty-list" element={<AdminFacultyList />} />
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
