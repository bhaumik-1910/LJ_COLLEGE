import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { ThemeModeContext } from '../theme.js'
import { Link as RouterLink } from 'react-router-dom'

const Header = () => {
    const [open, setOpen] = React.useState(false)
    const toggle = (val) => () => setOpen(val)

    const { mode, toggle: toggleMode } = React.useContext(ThemeModeContext)

    const isAdmin = (typeof window !== 'undefined' ? localStorage.getItem('role') : null) === 'admin'

    const links = [
        { href: '#programs', label: 'Programs' },
        { href: '#research', label: 'Research' },
        { href: '#campus', label: 'Campus Life' },
        { href: '#news', label: 'News' },
    ]

    const adminLinks = [
        { href: '/admin/university-register', label: 'U Register' },
    ]

    return (
        <>
            <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: (t) => t.palette.mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(8,12,30,0.6)', backdropFilter: 'saturate(180%) blur(10px)', color: 'text.primary' }}>
                <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'primary.main', background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, color: (t) => t.palette.mode === 'light' ? '#ffffff' : '#0b1020', fontWeight: 900, display: 'grid', placeItems: 'center' }}>LJ</Box>
                        <Typography variant="subtitle1" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 800 }}>LJ University</Typography>
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                        {links.map((l) => (
                            <Button key={l.href} color="inherit" href={l.href}>{l.label}</Button>
                        ))}
                        {isAdmin && adminLinks.map((l) => (
                            <Button key={l.href} color="inherit" component={RouterLink} to={l.href}>{l.label}</Button>
                        ))}
                        {/* Login and Register */}
                        <Button color="inherit" component={RouterLink} to="/login">Login</Button>
                        <Button variant="outlined" size="small" component={RouterLink} to="/register">Register</Button>
                        <Tooltip title={mode === 'light' ? 'Dark Mode' : 'Light Mode'}>
                            <IconButton color="inherit" onClick={toggleMode} aria-label="Toggle theme mode">
                                {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Box sx={{ display: { xs: 'inline-flex', md: 'none' }, alignItems: 'center', gap: .5 }}>
                        <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
                            <IconButton color="inherit" onClick={toggleMode} aria-label="Toggle theme mode">
                                {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                            </IconButton>
                        </Tooltip>
                        <IconButton color="inherit" onClick={toggle(true)} aria-label="Open menu">
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer anchor="right" open={open} onClose={toggle(false)}>
                <Box sx={{ width: 260 }} role="presentation" onClick={toggle(false)} onKeyDown={toggle(false)}>
                    <List>
                        {links.map((l) => (
                            <ListItem key={l.href} disablePadding>
                                <ListItemButton component="a" href={l.href}>
                                    <ListItemText primary={l.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        {isAdmin && adminLinks.map((l) => (
                            <ListItem key={l.href} disablePadding>
                                <ListItemButton component={RouterLink} to={l.href}>
                                    <ListItemText primary={l.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <ListItem disablePadding>
                            <ListItemButton component={RouterLink} to="/login">
                                <ListItemText primary="Login" />
                            </ListItemButton>
                        </ListItem>
                        {/* Optional: show register too */}
                        <ListItem disablePadding>
                            <ListItemButton component={RouterLink} to="/register">
                                <ListItemText primary="Register" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    )
}

export default Header
