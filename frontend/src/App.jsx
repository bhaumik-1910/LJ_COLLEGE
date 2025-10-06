import React from 'react'
import './App.css';
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Stats from './components/Stats.jsx'
import Programs from './components/Programs.jsx'
import Research from './components/Research.jsx'
import CampusLife from './components/CampusLife.jsx'
import NewsEvents from './components/NewsEvents.jsx'
import Testimonials from './components/Testimonials.jsx'
import AdmissionsCTA from './components/AdmissionsCTA.jsx'
import Footer from './components/Footer.jsx'


const App = () => {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Header />
      <Box component="main" flexGrow={1}>
        <Hero />
        <Container sx={{ py: 4 }}>
          <Stats />
          <Programs />
          <Research />
          <CampusLife />
          <NewsEvents />
          <Testimonials />
          <AdmissionsCTA />
        </Container>
      </Box>
      <Footer />
    </Box>
  )
}

export default App