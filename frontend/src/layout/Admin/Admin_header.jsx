// import React, { useEffect } from 'react'
// import AppBar from '@mui/material/AppBar'
// import Toolbar from '@mui/material/Toolbar'
// import Typography from '@mui/material/Typography'
// import IconButton from '@mui/material/IconButton'
// import Tooltip from '@mui/material/Tooltip'
// import Avatar from '@mui/material/Avatar'
// import Menu from '@mui/material/Menu'
// import MenuItem from '@mui/material/MenuItem'
// import Box from '@mui/material/Box'
// import LightModeIcon from '@mui/icons-material/LightMode'
// import DarkModeIcon from '@mui/icons-material/DarkMode'
// import { ThemeModeContext } from '../../theme.js'
// import { AuthContext } from '../../context/AuthContext'
// import { useNavigate } from 'react-router-dom'

// export default function AdminHeader() {
//   const { mode, toggle } = React.useContext(ThemeModeContext)
//   const { logout } = React.useContext(AuthContext)
//   const navigate = useNavigate()

//   useEffect(() => {
//     try { document.documentElement.setAttribute('data-theme', mode) } catch { }
//   }, [mode])

//   const email = (typeof window !== 'undefined' ? localStorage.getItem('email') : '') || ''
//   const avatarUrl = (typeof window !== 'undefined' ? localStorage.getItem('avatarUrl') : '') || ''

//   const [anchorEl, setAnchorEl] = React.useState(null)
//   const open = Boolean(anchorEl)
//   const handleOpen = (e) => setAnchorEl(e.currentTarget)
//   const handleClose = () => setAnchorEl(null)

//   const handleLogout = () => {
//     try { localStorage.removeItem('email'); localStorage.removeItem('avatarUrl') } catch { }
//     logout()
//     handleClose()
//     navigate('/login')
//   }

//   return (
//     <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: (t) => t.palette.mode === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(8,12,30,0.6)', color: 'text.primary' }}>
//       <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
//         <Typography variant="subtitle1" fontWeight={800}>Admin</Typography>
//         <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
//           <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
//             <IconButton color="inherit" onClick={toggle} aria-label="Toggle theme mode">
//               {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
//             </IconButton>
//           </Tooltip>
//           <IconButton color="inherit" onClick={handleOpen} aria-label="Account menu" size="small">
//             <Avatar sx={{ width: 32, height: 32 }} src={avatarUrl || undefined}>{(email || 'U').charAt(0).toUpperCase()}</Avatar>
//           </IconButton>
//           <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
//             <MenuItem disabled>{email || 'No email'}</MenuItem>
//             <MenuItem onClick={handleLogout}>Logout</MenuItem>
//           </Menu>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   )
// }
import React, { useEffect } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { ThemeModeContext } from '../../theme.js'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminHeader() {
  const { mode, toggle } = React.useContext(ThemeModeContext)
  const { logout, role } = React.useContext(AuthContext) // Get the 'role' from AuthContext
  const navigate = useNavigate()

  useEffect(() => {
    try { document.documentElement.setAttribute('data-theme', mode) } catch { }
  }, [mode])

  const email = (typeof window !== 'undefined' ? localStorage.getItem('email') : '') || ''
  const avatarUrl = (typeof window !== 'undefined' ? localStorage.getItem('avatarUrl') : '') || ''

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleOpen = (e) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleLogout = () => {
    try { localStorage.removeItem('email'); localStorage.removeItem('avatarUrl') } catch { }
    logout()
    handleClose()
    navigate('/login')
  }

  // Determine the display text based on the user's role
  const roleText = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User';

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: (t) => t.palette.mode === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(8,12,30,0.6)', color: 'text.primary' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Typography variant="subtitle1" fontWeight={800}>{roleText}</Typography>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
            <IconButton color="inherit" onClick={toggle} aria-label="Toggle theme mode">
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
          <IconButton color="inherit" onClick={handleOpen} aria-label="Account menu" size="small">
            <Avatar sx={{ width: 32, height: 32 }} src={avatarUrl || undefined}>{(email || 'U').charAt(0).toUpperCase()}</Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <MenuItem disabled>{email || 'No email'}</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}