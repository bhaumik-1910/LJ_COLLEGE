import React from 'react'
import { motion } from 'framer-motion'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const items = [
    { quote: 'LJ University empowered me to launch a career in AI with confidence and purpose.', name: 'Aarav Patel', meta: 'B.Tech CSE, Class of 2025' },
    { quote: 'Professors here go beyond the classroom. Their mentorship shaped my startup journey.', name: 'Neha Shah', meta: 'MBA, Class of 2025' },
]

const Testimonials = () => {
    return (
        <Box component="section" sx={{ py: 8 }}>
            <Container>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="overline" sx={{ letterSpacing: '.2em', color: 'secondary.main', fontWeight: 800 }}>Stories</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mt: .5 }}>What our students say</Typography>
                </Box>
                <Grid container spacing={2}>
                    {items.map((t, i) => (
                        <Grid item xs={12} md={6} key={i}>
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: .3 }}
                                transition={{ duration: .5, delay: i * 0.08 }}
                            >
                                <Card variant="outlined" sx={{ boxShadow: '0 2px 8px rgba(2,6,23,0.06)' }}>
                                    <CardContent>
                                        <Typography sx={{ fontSize: '1.05rem' }}>
                                            “{t.quote}”
                                        </Typography>
                                        <Box component="footer" sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', color: 'text.secondary' }}>
                                            <Typography fontWeight={700} color="text.primary">{t.name}</Typography>
                                            <Typography>{t.meta}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    )
}

export default Testimonials
