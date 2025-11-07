import { Outlet } from 'react-router-dom'
import Sidebar from '../SuperAdmin/Sidebar/Sidebar.jsx'
import SuperAdminHeader from '../SuperAdmin/SuperAdmin_header.jsx'

export default function AdminLayout() {
    return (
        <div className="app">
            <Sidebar />
            <div style={{ flex: 1, minWidth: 0 }}>
                <SuperAdminHeader />
                <Outlet />
            </div>
        </div>
    )
}
