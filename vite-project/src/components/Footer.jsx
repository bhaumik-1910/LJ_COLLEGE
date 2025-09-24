import React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

const Footer = () => (
    <Box component="footer" role="contentinfo" sx={{ mt: 8, borderTop: '1px solid', borderColor: 'divider', py: 5 }}>
        <Container>
            <Grid container spacing={4} alignItems="flex-start">
                <Grid item xs={12} md={4}>
                    <Box sx={{ mb: 1.5, display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 3, color: '#fff', background: (t) => `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`, fontWeight: 900 }}>
                        LJ
                    </Box>
                    <Typography variant="body2" color="text.secondary"> {new Date().getFullYear()} LJ University. All rights reserved.</Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Typography fontWeight={600} sx={{ mb: 1 }}>Explore</Typography>
                            <Link underline="hover" color="text.secondary" display="block" href="#programs">Programs</Link>
                            <Link underline="hover" color="text.secondary" display="block" href="#research">Research</Link>
                            <Link underline="hover" color="text.secondary" display="block" href="#campus">Campus Life</Link>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography fontWeight={600} sx={{ mb: 1 }}>Admissions</Typography>
                            <Link underline="hover" color="text.secondary" display="block" href="#admissions">Apply</Link>
                            <Link underline="hover" color="text.secondary" display="block" href="#">Scholarships</Link>
                            <Link underline="hover" color="text.secondary" display="block" href="#">Visit</Link>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography fontWeight={600} sx={{ mb: 1 }}>Connect</Typography>
                            <Link underline="hover" color="text.secondary" display="block" href="#">Alumni</Link>
                            <Link underline="hover" color="text.secondary" display="block" href="#">Careers</Link>
                            <Link underline="hover" color="text.secondary" display="block" href="#">Contact</Link>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    </Box>
)

export default Footer
