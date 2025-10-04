import React from 'react'
import { motion } from 'framer-motion'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'

const items = [
    { date: 'Oct 10', title: 'Innovation Summit 2025', desc: 'Showcasing student startups and research demos.' },
    { date: 'Oct 21', title: 'Global Lecture Series', desc: 'Nobel laureate keynote on sustainable cities.' },
    { date: 'Nov 02', title: 'Open House', desc: 'Explore labs, meet students, and tour campus.' },
]

const NewsEvents = () => {
    return (
        <Box component="section" id="news" sx={{ py: 8 }}>
            <Container>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="overline" sx={{ letterSpacing: '.2em', color: 'secondary.main', fontWeight: 800 }}>News & Events</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mt: .5 }}>What’s happening on campus</Typography>
                </Box>
                <Grid container spacing={2}>
                    {items.map((n, i) => (
                        <Grid item xs={12} key={i}>
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: .3 }}
                                transition={{ duration: .5, delay: i * 0.07 }}
                            >
                                <Card variant="outlined" sx={{ p: 1, boxShadow: '0 2px 8px rgba(2,6,23,0.06)', width: '100%' }}>
                                    <CardContent sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr auto' }, alignItems: 'center', gap: 2 }}>
                                        <Typography variant="subtitle1" fontWeight={800} color="warning.main" sx={{ minWidth: 64 }}>{n.date}</Typography>
                                        <Box>
                                            <Typography fontWeight={600}>{n.title}</Typography>
                                            <Typography color="text.secondary">{n.desc}</Typography>
                                        </Box>
                                        <Link href="#" underline="hover" sx={{ fontWeight: 600, color: 'primary.main' }}>Learn more →</Link>
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

export default NewsEvents
