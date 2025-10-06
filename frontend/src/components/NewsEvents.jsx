import React from 'react'
import { motion } from 'framer-motion'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'

const items = [
    { date: 'Oct 10', title: 'Innovation Summit 2025', desc: 'Showcasing student startups and research demos.' },
    { date: 'Oct 21', title: 'Global Lecture Series', desc: 'Nobel laureate keynote on sustainable cities.' },
    { date: 'Nov 02', title: 'Open House', desc: 'Explore labs, meet students, and tour campus.' },
]

const NewsEvents = () => {
    return (
        <Box component="section" id="news" sx={{ py: 5 }}>
            <Container>
                <Typography
                    variant="overline"
                    sx={{ letterSpacing: '.2em', color: 'secondary.main', fontWeight: 800 }}
                >
                    News & Events
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: .5, mb: 5 }}>
                    What’s happening on campus
                </Typography>

                <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
                    {items.map((n, i) => (
                        <Grid item xs={12} sm={10} md={8} key={i}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: .3 }}
                                transition={{ duration: .5, delay: i * 0.1 }}
                                style={{ width: '100%' }}
                            >
                                <Card
                                    variant="outlined"
                                    sx={{ p: 1, boxShadow: '0 4px 12px rgba(2,6,23,0.1)', width: '100', borderRadius: 2 }}
                                >
                                    <CardContent
                                        sx={{
                                            // display: 'grid',
                                            // gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr auto' },
                                            alignItems: 'center',
                                            gap: { xs: 1.5, sm: 3 }
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight={800}
                                            color="warning.main"
                                            sx={{
                                                minWidth: 80,
                                                textAlign: { xs: 'left', sm: 'center' },
                                                pr: { sm: 3 }
                                            }}
                                        >
                                            {n.date}
                                        </Typography>
                                        <Box>
                                            <Typography fontWeight={600}>{n.title}</Typography>
                                            <Typography color="text.secondary" variant="body2">{n.desc}</Typography>
                                        </Box>
                                    </CardContent>

                                    <CardActions sx={{ mt: 'auto' }}>
                                        <Button size="small" href="#admissions">
                                            Learn more →
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

export default NewsEvents
