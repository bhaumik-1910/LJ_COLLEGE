import React from 'react'
import { motion } from 'framer-motion'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

const Item = ({ k, v, delay = 0 }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .4 }} transition={{ duration: .5, delay }}>
        <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
            <Typography variant="h5" fontWeight={800}>{k}</Typography>
            <Typography color="text.secondary">{v}</Typography>
        </Paper>
    </motion.div>
)

const Stats = () => (
    <Box component="section" sx={{ py: 4, borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Grid container spacing={2}>
            <Grid item xs={6} md={3}><Item k="200+" v="Programs" delay={0.05} /></Grid>
            <Grid item xs={6} md={3}><Item k="35k+" v="Students" delay={0.1} /></Grid>
            <Grid item xs={6} md={3}><Item k="1200+" v="Faculty" delay={0.15} /></Grid>
            <Grid item xs={6} md={3}><Item k="$150M" v="Annual Research" delay={0.2} /></Grid>
        </Grid>
    </Box>
)

export default Stats
