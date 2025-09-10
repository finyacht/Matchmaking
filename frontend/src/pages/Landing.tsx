import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material';

const Landing = () => {
  return (
    <Box>
      {/* Hero Section with Professional Design */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f1419 0%, #1a237e 50%, #283593 100%)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 70% 80%, rgba(25, 118, 210, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            {/* Left Column - Content */}
            <Grid item xs={12} md={7}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                {/* Logo and Brand */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 4 }}>
                  <Box
                    component="img"
                    src="/fuel-fund-logo.svg"
                      alt="Fund Fuel Logo"
                    sx={{
                      width: 80,
                      height: 80,
                      mr: 2,
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                    }}
                  />
                  <Typography
                    component="h1"
                    sx={{
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      letterSpacing: '-2px',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    FUND FUEL
                  </Typography>
                </Box>

                {/* Main Headline */}
                <Typography
                  variant="h2"
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' },
                    lineHeight: 1.2,
                    mb: 3,
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  Where Innovation
                  <Box component="span" sx={{ 
                    display: 'block',
                    background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    Meets Investment
                  </Box>
                </Typography>

                {/* Subtitle */}
                <Typography
                  variant="h5"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: 300,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    lineHeight: 1.6,
                    mb: 4,
                    maxWidth: '600px',
                    mx: { xs: 'auto', md: 0 },
                  }}
                >
                  AI-powered matchmaking platform connecting visionary startups 
                  with strategic investors through intelligent compatibility analysis.
                </Typography>

                {/* CTA Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 3, 
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  flexWrap: 'wrap',
                  mb: 4 
                }}>
                  <Button
                    component={RouterLink}
                    to="/signup"
                    variant="contained"
                    size="large"
                    sx={{
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      color: 'white',
                      borderRadius: 4,
                      px: 5,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                        boxShadow: '0 12px 32px rgba(25, 118, 210, 0.4)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Start Matching
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      borderWidth: 2,
                      borderRadius: 4,
                      px: 5,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      backdropFilter: 'blur(10px)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        borderColor: '#64b5f6',
                        backgroundColor: 'rgba(100, 181, 246, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Sign In
                  </Button>
                </Box>

                {/* Trust Indicators */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#64b5f6', fontWeight: 700 }}>500+</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Active Startups</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#64b5f6', fontWeight: 700 }}>200+</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Verified Investors</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#64b5f6', fontWeight: 700 }}>$50M+</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Funding Raised</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Right Column - Visual Element */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  position: 'relative',
                  textAlign: 'center',
                  display: { xs: 'none', md: 'block' },
                }}
              >
                <Box
                  sx={{
                    width: 400,
                    height: 400,
                    background: 'linear-gradient(135deg, rgba(100, 181, 246, 0.1) 0%, rgba(25, 118, 210, 0.1) 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    mx: 'auto',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      width: '120%',
                      height: '120%',
                      border: '1px solid rgba(100, 181, 246, 0.2)',
                      borderRadius: '50%',
                      top: '-10%',
                      left: '-10%',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '140%',
                      height: '140%',
                      border: '1px solid rgba(100, 181, 246, 0.1)',
                      borderRadius: '50%',
                      top: '-20%',
                      left: '-20%',
                    }
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      color: '#64b5f6',
                      fontWeight: 300,
                      textAlign: 'center',
                      lineHeight: 1.4,
                    }}
                  >
                    AI-Powered
                    <br />
                    Matching
                    <br />
                    Engine
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ bgcolor: '#f8fafc', py: 10 }}>
        <Container maxWidth="lg">
          {/* Section Header */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: '#1a237e',
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              The Future of Startup Funding
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#64748b',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                fontWeight: 300,
              }}
            >
              Experience the next generation of investment matching powered by advanced AI technology
            </Typography>
          </Box>
          
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Box 
                sx={{ 
                  textAlign: 'center',
                  p: 4,
                  height: '100%',
                  position: 'relative',
                  '&:hover .feature-icon': {
                    transform: 'scale(1.1) rotate(5deg)',
                  }
                }}
              >
                <Box 
                  className="feature-icon"
                  sx={{ 
                    width: 100,
                    height: 100,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    fontSize: '2.5rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                  }}
                >
                  🧠
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1a237e' }}>
                  Intelligent Matching
                </Typography>
                <Typography sx={{ color: '#64748b', lineHeight: 1.7, fontSize: '1.1rem' }}>
                  Our advanced AI analyzes hundreds of data points including sector expertise, 
                  investment stage, geographical preferences, and strategic fit.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box 
                sx={{ 
                  textAlign: 'center',
                  p: 4,
                  height: '100%',
                  position: 'relative',
                  '&:hover .feature-icon': {
                    transform: 'scale(1.1) rotate(5deg)',
                  }
                }}
              >
                <Box 
                  className="feature-icon"
                  sx={{ 
                    width: 100,
                    height: 100,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    fontSize: '2.5rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 10px 30px rgba(240, 147, 251, 0.3)',
                  }}
                >
                  ⚡
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1a237e' }}>
                  Instant Connections
                </Typography>
                <Typography sx={{ color: '#64748b', lineHeight: 1.7, fontSize: '1.1rem' }}>
                  Real-time notifications and seamless communication tools ensure you never 
                  miss an opportunity. Connect instantly when mutual interest is detected.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box 
                sx={{ 
                  textAlign: 'center',
                  p: 4,
                  height: '100%',
                  position: 'relative',
                  '&:hover .feature-icon': {
                    transform: 'scale(1.1) rotate(5deg)',
                  }
                }}
              >
                <Box 
                  className="feature-icon"
                  sx={{ 
                    width: 100,
                    height: 100,
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    fontSize: '2.5rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 10px 30px rgba(79, 172, 254, 0.3)',
                  }}
                >
                  📈
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1a237e' }}>
                  Data-Driven Insights
                </Typography>
                <Typography sx={{ color: '#64748b', lineHeight: 1.7, fontSize: '1.1rem' }}>
                  Comprehensive analytics dashboard provides actionable insights to optimize 
                  your profile and increase successful match rates.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 20%, rgba(100, 181, 246, 0.1) 0%, transparent 50%)',
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              sx={{ 
                color: 'white', 
                fontWeight: 700, 
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Ready to Transform Your Future?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                mb: 4,
                fontWeight: 300,
                lineHeight: 1.6
              }}
            >
              Join the revolution in startup funding. Connect with the right investors 
              or discover your next unicorn investment opportunity.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Button
                component={RouterLink}
                to="/signup"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%)',
                  color: 'white',
                  borderRadius: 4,
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 8px 24px rgba(100, 181, 246, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #42a5f5 0%, #2196f3 100%)',
                    boxShadow: '0 12px 32px rgba(100, 181, 246, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Start Your Journey
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  borderWidth: 2,
                  borderRadius: 4,
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    borderColor: '#64b5f6',
                    backgroundColor: 'rgba(100, 181, 246, 0.2)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Demo Login
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
