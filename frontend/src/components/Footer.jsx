import React, { useState, useCallback } from "react";
import {
    Box,
    Grid,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    useTheme,
} from "@mui/material";
import { styled, keyframes } from '@mui/system';
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import PhoneIcon from '@mui/icons-material/Phone';
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import PinterestIcon from "@mui/icons-material/Pinterest";
import logo from '../assets/images/f_uni.png'

// Mock Toast for newsletter submission feedback
const useToast = () => ({
    error: (message) => console.error("Toast Error:", message),
    success: (message) => console.log("Toast Success:", message),
});

// --- ANIMATION KEYFRAMES ---
const pulseUnderline = keyframes`
  0% { transform: scaleX(0.95); opacity: 0.9; }
  50% { transform: scaleX(1.0); opacity: 1.0; }
  100% { transform: scaleX(0.95); opacity: 0.9; }
`;

const backgroundShift = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

const slideIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

// --- FOOTER STYLING ---
const FooterContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(6),
    color: 'white',
    padding: theme.spacing(8, 4),
    position: 'relative',
    overflow: 'hidden',
    borderTopRightRadius: '200px',
    // Animated Gradient Background
    background: 'linear-gradient(45deg, #0f172a, #301934, #0f172a)',
    backgroundSize: '200% 200%',
    animation: `${backgroundShift} 15s ease infinite`,

    // Curve effect (TOP-RIGHT)
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#0f172a',
        zIndex: -1,
        [theme.breakpoints.down('md')]: {
            borderTopRightRadius: '150px',
        },
        [theme.breakpoints.down('sm')]: {
            borderTopRightRadius: '50px',
        },
    },
}));

const FooterLink = styled(Typography)({
    cursor: 'pointer',
    marginBottom: '8px',
    transition: 'color 0.3s ease, transform 0.3s ease',
    '&:hover': {
        color: '#6fa8dc',
        transform: 'translateX(8px)',
    },
});

const AnimatedTitle = styled(Typography)(({ theme }) => ({
    mb: theme.spacing(2),
    fontWeight: 600,
    pb: 0.5,
    display: 'inline-block',
    position: 'relative',
    color: '#E0E0E0',

    // Underline pulse animation
    '&::after': {
        content: '""',
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: '2px',
        backgroundColor: '#512da8',
        transformOrigin: 'bottom',
        animation: `${pulseUnderline} 2s ease-in-out infinite`,
        transition: 'all 0.3s ease',
    },
    '&:hover::after': {
        width: '105%',
        backgroundColor: '#6fa8dc',
    }
}));

const SocialIconBox = styled(Box)({
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        backgroundColor: '#512da8',
        transform: 'scale(1.2) translateY(-5px)',
        boxShadow: '0 0 20px #512da8',
    },
});

const NewsletterBox = styled(Grid)({
    animation: `${slideIn} 1s ease-out 0.5s forwards`,
    opacity: 0,
});

const Footer = () => {
    const toast = useToast();
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const theme = useTheme();

    const handleChange = useCallback((e) => {
        setNewsletterEmail(e.target.value);
    }, []);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (newsletterEmail && newsletterEmail.includes('@')) {
            toast.success(`Subscribed ${newsletterEmail} to the newsletter!`);
            setNewsletterEmail("");
        } else {
            toast.error("Please enter a valid email address.");
        }
    };

    return (
        <>
            <FooterContainer>
                {/* Ensure inner content is constrained and has padding */}
                <Grid container spacing={4} sx={{ maxWidth: 1200, margin: '0 auto', px: 2 }}>

                    {/* Column 1: Logo and Description */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,       
                                mb: 2,
                            }}
                        >
                            {/* Logo */}
                            <Box component="img" src={logo} alt="Logo" width={50} height={50} />

                            {/* University text */}
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: 700, color: 'white' }}
                            >
                                University
                            </Typography>
                        </Box>

                        <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                            Subscribe to our YouTube channel to watch videos on web development and press the bell icon for the latest notifications.
                        </Typography>
                        {/* Social Icons */}
                        <Box sx={{ mt: 3, display: 'flex' }}>
                            <SocialIconBox><YouTubeIcon fontSize="small" /></SocialIconBox>
                            <SocialIconBox><FacebookIcon fontSize="small" /></SocialIconBox>
                            <SocialIconBox><TwitterIcon fontSize="small" /></SocialIconBox>
                            <SocialIconBox><PinterestIcon fontSize="small" /></SocialIconBox>
                        </Box>
                    </Grid>

                    {/* Column 2: Office */}
                    <Grid item xs={12} sm={6} md={3}>
                        <AnimatedTitle variant="h6" sx={{ mb: 2 }}>
                            Office
                        </AnimatedTitle>
                        <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                            LJ Campus, LJ University Rd, off Sarkhej - Gandhinagar Highway, Makarba, Ahmedabad, Gujarat 382210
                        </Typography>
                        <FooterLink variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon fontSize="small" sx={{ mr: 1, color: '#6fa8dc' }} /> ljuniversity@gmail.com
                        </FooterLink>
                        <FooterLink variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon fontSize="small" sx={{ mr: 1, color: '#6fa8dc' }} /> +91 - 9313629723
                        </FooterLink>
                    </Grid>

                    {/* Column 3: Links */}
                    <Grid item xs={12} sm={6} md={3}>
                        <AnimatedTitle variant="h6" sx={{ mb: 2 }}>
                            Links
                        </AnimatedTitle>
                        <Box>
                            {['Home', 'Services', 'About Us', 'Features', 'Contacts'].map(link => (
                                <FooterLink key={link} variant="body2" onClick={() => console.log(`Navigating to ${link}`)}>
                                    {link}
                                </FooterLink>
                            ))}
                        </Box>
                    </Grid>

                    {/* Column 4: Newsletter (Animated Entrance) */}
                    <NewsletterBox item xs={12} sm={6} md={3}>
                        <AnimatedTitle variant="h6" sx={{ mb: 2 }}>
                            Newsletter
                        </AnimatedTitle>
                        <Box component="form" onSubmit={handleNewsletterSubmit}>
                            <TextField
                                fullWidth
                                variant="standard"
                                name="newsletterEmail"
                                value={newsletterEmail}
                                onChange={handleChange}
                                placeholder="Enter your email id"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon sx={{ color: 'white', opacity: 0.7 }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton type="submit" size="small" sx={{ color: '#6fa8dc' }}>
                                                <SendIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        // Ensure input colors and borders are styled for the dark background
                                        '& .MuiInputBase-input': { color: 'white' },
                                        '& .MuiInputBase-input::placeholder': { opacity: 0.7, color: 'white' },
                                        '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255, 255, 255, 0.4)' },
                                        '& .MuiInput-underline:after': { borderBottomColor: '#6fa8dc' },
                                    }
                                }}
                            />
                        </Box>
                    </NewsletterBox>
                </Grid>

            </FooterContainer>

            {/* Copyright Line */}
            <Box sx={{ bgcolor: '#0f172a', color: 'white', textAlign: 'center', py: 1 }}>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    &copy; {new Date().getFullYear()} University. All Rights Reserved.
                </Typography>
            </Box>
        </>
    );
};

export default Footer;
