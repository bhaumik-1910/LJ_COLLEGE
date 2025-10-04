import React from 'react'
import { motion } from 'framer-motion'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const items = [
    { title: 'Vibrant Campus', img: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop' },
    { title: 'Clubs & Societies', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop' },
    { title: 'Global Opportunities', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop' },
]

const CampusLife = () => {
    return (
        <Box component="section" id="campus" sx={{ py: 8 }}>
            <Container>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="overline" sx={{ letterSpacing: '.2em', color: 'secondary.main', fontWeight: 800 }}>Campus Life</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mt: .5 }}>More than a degree</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>Grow through leadership, culture, sports, and service.</Typography>
                </Box>

                <Grid container spacing={8}>
                    {items.map((i, idx) => (
                        <Grid item xs={12} md={4} key={idx}>
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: .3 }}
                                transition={{ duration: .5, delay: idx * 0.08 }}
                                whileHover={{ scale: 1.01 }}
                            >
                                <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                    <Box component="img" src={i.img} alt={i.title} sx={{ display: 'block', width: '100%', height: 224, objectFit: 'cover' }} />
                                    <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,0,0,.5)', backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.5))', p: 2, fontWeight: 700, color: '#fff' }}>{i.title}</Box>
                                </Box>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    )
}

export default CampusLife
