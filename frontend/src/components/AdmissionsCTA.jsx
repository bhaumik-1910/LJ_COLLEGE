import React from 'react'
import { motion } from 'framer-motion'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

const AdmissionsCTA = () => (
    <Box component="section" id="admissions" aria-label="Admissions call to action" sx={{ py: 6 }}>
        <Container>
            <Box sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                px: { xs: 3, md: 4 },
                py: { xs: 3, md: 4 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 3,
                flexDirection: { xs: 'column', md: 'row' },
                background: (t) => `linear-gradient(135deg, ${t.palette.primary.main}1A, ${t.palette.secondary.main}1A)`,
            }}>
                <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .6 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>Ready to apply?</Typography>
                    <Typography color="text.secondary" sx={{ mt: .5 }}>
                        Applications are open for the {new Date().getFullYear()}–{new Date().getFullYear() + 1} academic year. Scholarships available.
                    </Typography>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .6, delay: .05 }}>
                    <Stack direction="row" spacing={1.5} sx={{ width: '100%', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                        <Button href="#" variant="contained">Start application</Button>
                        <Button href="#programs" variant="outlined">Find a program</Button>
                    </Stack>
                </motion.div>
            </Box>
        </Container>
    </Box>
)

export default AdmissionsCTA
