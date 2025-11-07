import Sidebar from './Sidebar/Sidebar.jsx'
import { Outlet } from 'react-router-dom'
import SuperAdminHeader from './SuperAdmin_header.jsx'

export default function SuperAdminLayout() {
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
