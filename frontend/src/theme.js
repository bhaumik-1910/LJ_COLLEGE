import React from 'react'
import { createTheme } from '@mui/material/styles'

export const ThemeModeContext = React.createContext({ mode: 'light', toggle: () => { } })

export const getTheme = (mode = 'light') =>
    createTheme({
        palette: {
            mode,
            primary: { main: '#4f7cff' },
            secondary: { main: '#0ea5a0' },
            background: mode === 'light'
                ? { default: '#ffffff', paper: '#f8fafc' }
                : { default: '#0b1020', paper: '#111733' },
            text: mode === 'light'
                ? { primary: '#0b1020', secondary: '#475569' }
                : { primary: '#e6ebff', secondary: '#9aa4bf' },
            warning: { main: mode === 'light' ? '#f59e0b' : '#ffc857' },
        },
        shape: { borderRadius: 12 },
        typography: {
            fontFamily: [
                'Inter',
                'system-ui',
                '-apple-system',
                'Segoe UI',
                'Roboto',
                'Helvetica',
                'Arial',
                'Apple Color Emoji',
                'Segoe UI Emoji',
            ].join(','),
            h1: { fontWeight: 800 },
            h2: { fontWeight: 800 },
            h3: { fontWeight: 700 },
            button: { fontWeight: 700, textTransform: 'none' },
        },
        components: {
            MuiContainer: { defaultProps: { maxWidth: 'lg' } },
            MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
        },
    })

export default getTheme
