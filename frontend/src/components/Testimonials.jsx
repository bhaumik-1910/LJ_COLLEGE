import React from 'react'
import { motion } from 'framer-motion'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'

const items = [
    { quote: 'LJ University empowered me to launch a career in AI with confidence and purpose.', name: 'Aarav Patel', meta: 'B.Tech CSE, Class of 2025' },
    { quote: 'Professors here go beyond the classroom. Their mentorship shaped my startup journey.', name: 'Neha Shah', meta: 'MBA, Class of 2025' },
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

                <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
                    {items.map((t, i) => (
                        <Grid item xs={12} sm={10} md={8} key={i}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: .3 }}
                                transition={{ duration: .5, delay: i * 0.1 }}
                                style={{ width: '100%' }}
                            >
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {t.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            “{t.quote}”
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ mt: 'auto' }}>
                                        <Button size="small" href="#admissions">
                                            {t.meta}
                                        </Button>
                                    </CardActions>
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
