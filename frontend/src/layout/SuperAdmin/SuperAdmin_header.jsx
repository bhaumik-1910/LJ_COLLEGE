import React, { useContext, useEffect, useState } from 'react'
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
import { AuthContext } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { SidebarContext } from '../../context/SuperAdmin/sidebarContext.jsx'
import { iconsImgs } from '../../utils/SuperAdmin/images.js'

// const API_BASE = "http://localhost:5000/api";
const API_BASE = import.meta.env.VITE_API_BASE;

export default function SuperAdminHeader() {
  const { mode, toggle } = useContext(ThemeModeContext)
  const { logout, role, token } = useContext(AuthContext) // Get the 'role' from AuthContext
  const { toggleSidebar } = useContext(SidebarContext); // Get the 'toggleSidebar' function from SidebarContext
  const navigate = useNavigate()

  useEffect(() => {
    try { document.documentElement.setAttribute('data-theme', mode) } catch { }
  }, [mode])

  const email = (typeof window !== 'undefined' ? localStorage.getItem('email') : '') || ''
  const avatarUrl = (typeof window !== 'undefined' ? localStorage.getItem('avatarUrl') : '') || ''

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleOpen = (e) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleLogout = () => {
    try { localStorage.removeItem('email'); localStorage.removeItem('avatarUrl') } catch { }
    logout()
    handleClose()
    navigate('/login')
  }

  //University So and Avtar Image So
  const [universityName, setUniversityName] = useState('')
  const [avatar, setAvatar] = useState('')

  // Fetch for faculty or admin
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      // Determine the API endpoint based on the user's role
      let apiEndpoint;
      if (role === 'superadmin') {
        apiEndpoint = `${API_BASE}/superadmin/me`;
      } else if (['faculty', 'admin'].includes(role)) {
        apiEndpoint = `${API_BASE}/faculty/me`;
      } else {
        return;
      }

      try {
        const res = await fetch(apiEndpoint, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();

        if (res.ok) {
          if (data?.university) setUniversityName(data.university);
          if (data?.avatarUrl !== undefined) {
            setAvatar(data.avatarUrl || '');
            try { localStorage.setItem('avatarUrl', data.avatarUrl || ''); } catch (e) { }
          }
        }
      } catch (e) {
        console.error("Failed to fetch user data:", e);
      }
    };
    fetchUserData();
  }, [token, role]);

  //Direct Update Avatar
  useEffect(() => {
    const onProfileUpdated = (e) => {
      const newUrl = e?.detail?.avatarUrl || '';
      setAvatar(newUrl);
      try { localStorage.setItem('avatarUrl', newUrl) } catch { }
    };
    window.addEventListener('profile:updated', onProfileUpdated);
    return () => window.removeEventListener('profile:updated', onProfileUpdated);
  }, []);



  // Determine the display text based on the user's role
  // const roleText = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User';
  const roleText = role === 'admin' ? 'Admin' : role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User';

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: (t) => t.palette.mode === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(8,12,30,0.6)', color: 'text.primary' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>

        {/* Left Side: Group the icon and typography */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => toggleSidebar()}>
            <img src={iconsImgs.menuIcon} alt="menu icon" style={{ width: '20px' }} />
          </IconButton>
          <Typography variant="subtitle1" fontWeight={800}>
            {roleText}{['faculty', 'admin'].includes(role) && universityName ? ` - ${universityName}` : ''}
          </Typography>
        </Box>

        {/* Right Side: Keep the existing buttons */}
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
          {/* <Tooltip title={mode === 'light' ? 'dark mode' : 'light mode'}>
            <IconButton color="inherit" onClick={toggle} aria-label="Toggle theme mode">
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip> */}
          <IconButton color="inherit" onClick={handleOpen} aria-label="Account menu" size="small">
            <Avatar
              sx={{ width: 32, height: 32 }}
              src={(avatar || avatarUrl) || undefined}
              alt={email || 'User'}
            >
              {(email || 'U').charAt(0).toUpperCase()}
            </Avatar>
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