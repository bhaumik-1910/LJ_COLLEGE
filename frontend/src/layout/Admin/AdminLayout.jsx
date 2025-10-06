import React from 'react'
import Sidebar from './Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'
import AdminHeader from './Admin_header.jsx'

export default function AdminLayout() {
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
