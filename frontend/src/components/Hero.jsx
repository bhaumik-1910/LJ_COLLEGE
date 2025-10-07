import React from 'react'
import { motion } from 'framer-motion'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const DEFAULT_BG = 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=2000&auto=format&fit=crop'

const Hero = () => {
    return (
        <Box component="section" id="home" sx={{ position: 'relative', minHeight: { xs: '72vh', md: '78vh' }, display: 'grid', alignItems: 'center', overflow: 'hidden' }}>
            <Box
                sx={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${DEFAULT_BG})`,
                    backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.55)'
                }}
                role="img"
                aria-label="Campus building with students"
            />
            <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%', background: 'linear-gradient(180deg, transparent, rgba(11,16,32,.9))' }} />

            <Container sx={{ position: 'relative', py: { xs: 8, md: 10 } }}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .1 }}>
                    <Typography variant="overline" sx={{ letterSpacing: '.2em', color: 'secondary.main', fontWeight: 800 }}>Discover • Learn • Lead</Typography>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .2 }}>
                    <Typography variant="h2" color="common.white" sx={{ fontWeight: 800, mt: 1 }}>Shape the future at University</Typography>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .3 }}>
                    <Typography sx={{ mt: 2, maxWidth: 900, color: 'rgba(255,255,255,0.85)' }}>
                        A vibrant community of scholars and innovators committed to excellence in teaching, research, and impact.
                    </Typography>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .4 }}>
                    <Stack direction="row" spacing={1.5} sx={{ mt: 3, flexWrap: 'wrap' }}>
                        <Button href="#admissions" variant="contained">Apply Now</Button>
                        <Button href="#programs" variant="outlined">Explore Programs</Button>
                    </Stack>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6 }}>
                    <Stack direction="row" spacing={1} sx={{ mt: 3, flexWrap: 'wrap' }}>
                        <ChipLike>Top 1% Research Impact</ChipLike>
                        <ChipLike>#1 Student Satisfaction</ChipLike>
                        <ChipLike>Global Alumni Network</ChipLike>
                    </Stack>
                </motion.div>
            </Container>
        </Box>
    )
}

const ChipLike = ({ children }) => (
    <Box sx={{
        border: '1px solid rgba(255,255,255,.3)',
        bgcolor: 'rgba(255,255,255,.2)',
        px: 1.5, py: 1, borderRadius: 999,
        fontSize: 14, color: '#ffffff',
    }}>
        {children}
    </Box>
)

export default Hero
