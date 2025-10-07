import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Admin/Sidebar/Sidebar.jsx'
import AdminHeader from '../Admin/Admin_header.jsx'

export default function FacultyLayout() {
    return (
        <div className="app">
            <Sidebar />
            <div style={{ flex: 1, minWidth: 0 }}>
                <AdminHeader />
                <Outlet />
            </div>
        </div>
    )
}
