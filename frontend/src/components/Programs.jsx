import React from 'react';
import { motion } from 'framer-motion';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';

const items = [
    {
        title: 'Engineering & Technology',
        img: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop',
        desc: 'Cutting-edge curricula across AI, Data Science, Civil, Mechanical, and more.',
    },
    {
        title: 'Business & Management',
        img: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop',
        desc: 'Entrepreneurship-focused programs connecting you to industry leaders.',
    },
    {
        title: 'Arts & Humanities',
        img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop',
        desc: 'Creative, critical, and global perspectives for the modern world.',
    }
];

const Programs = () => {
    return (
        <Box component="section" id="programs" sx={{ py: 8 }}>
            <Container>
                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="overline"
                        sx={{ letterSpacing: '.2em', color: 'secondary.main', fontWeight: 800 }}
                    >
                        Academics
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                        Explore our programs
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                        Undergraduate, postgraduate, and doctoral programs designed for impact.
                    </Typography>
                </Box>

                <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
                    {items.map((item, i) => (
                        <Grid item xs={12} sm={6} key={i} sx={{ display: 'flex' }}>
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                            >
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardMedia
                                        sx={{ height: 140 }}
                                        image={item.img}
                                        alt={item.title}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            {item.desc}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ mt: 'auto' }}>
                                        <Button size="small" href="#admissions">
                                            View details
                                        </Button>
                                    </CardActions>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Programs;
