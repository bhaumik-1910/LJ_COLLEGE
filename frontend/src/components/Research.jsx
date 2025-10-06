import React from 'react'
import { motion } from 'framer-motion'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

// Lab-themed background images (change these URLs to update visuals)
const LAB_IMG_LEFT = 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1600&auto=format&fit=crop'
const LAB_IMG_RIGHT = 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=2000&auto=format&fit=crop'

const highlights = [
    'AI for healthcare diagnostics',
    'Sustainable infrastructure and smart cities',
    'Climate resilience and clean energy',
    'Entrepreneurship, startups, and venture labs',
]

const Research = () => {
    return (
        <Box component="section" id="research" sx={{ py: 8 }}>
            <Container>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={7}>
                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .6 }}>
                            <Typography variant="overline" sx={{ letterSpacing: '.2em', color: 'secondary.main', fontWeight: 800 }}>Research</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800, mt: .5 }}>Advancing knowledge for real-world impact</Typography>
                            <Typography color="text.secondary" sx={{ mt: 1 }}>Our research centers drive innovation across disciplines, partnering with industry and communities.</Typography>
                            <Box component="ul" sx={{ mt: 2, pl: 0, listStyle: 'none', display: 'grid', gap: 1.25 }}>
                                {highlights.map((h, i) => (
                                    <Box key={i} component="li" sx={{ position: 'relative', pl: 3 }}>
                                        <Box sx={{ position: 'absolute', left: 0, top: 8, width: 12, height: 12, borderRadius: '50%', background: (t) => `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})` }} />
                                        {h}
                                    </Box>
                                ))}
                            </Box>
                            <Stack direction="row" spacing={1.5} sx={{ mt: 2, flexWrap: 'wrap' }}>
                                <Button href="#admissions" variant="contained">Join a lab</Button>
                                <Button href="#news" variant="outlined">Read research news</Button>
                            </Stack>
                        </motion.div>
                    </Grid>

                    {/* <Grid item xs={12} md={5}>
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .6 }}>
                            <Box sx={{ position: 'relative', minHeight: 360 }}>
                                <Box sx={{ position: 'absolute', inset: 0, right: '33%', bottom: '33%', borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', backgroundImage: `url(${LAB_IMG_LEFT})`, backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 16px 40px -16px rgba(2,6,23,0.2)' }} />
                                <Box sx={{ position: 'absolute', left: '40%', top: '20%', bottom: 0, right: 0, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', backgroundImage: `url(${LAB_IMG_LEFT})`, backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 16px 40px -16px rgba(2,6,23,0.2)' }} />
                            </Box>
                        </motion.div>
                    </Grid> */}
                </Grid>
            </Container>
        </Box>
    )
}

export default Research
