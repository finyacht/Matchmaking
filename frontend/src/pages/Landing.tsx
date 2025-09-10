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
      {/* Hero Section with Fuel Fund Branding */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          pt: 8,
          pb: 6,
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="lg">
          {/* Logo Section */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              component="img"
              src="/fuel-fund-logo.svg"
              alt="Fuel Fund Logo"
              sx={{
                width: 200,
                height: 'auto',
                mb: 2,
              }}
            />
            <Typography
              component="h1"
              variant="h2"
              align="center"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #1976d2, #e53935)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                letterSpacing: '-1px',
                mb: 2,
              }}
            >
              FUEL FUND
            </Typography>
            <Typography
              variant="h4"
              align="center"
              sx={{
                color: 'white',
                fontWeight: 300,
                mb: 2,
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              Powering the Future of Startup Investment
            </Typography>
          </Box>

          <Typography
            variant="h5"
            align="center"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 4,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
            }}
          >
            Our AI-powered platform matches startups with investors based on
            sector fit, stage alignment, and mutual preferences.
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#e53935',
                '&:hover': { bgcolor: '#c62828' },
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Get Started
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: '#e53935',
                  bgcolor: 'rgba(229, 57, 53, 0.1)',
                },
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 700,
            mb: 6,
            color: '#1976d2',
          }}
        >
          Why Choose Fuel Fund?
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-5px)' },
                borderRadius: 3,
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box sx={{ fontSize: '3rem', mb: 2 }}>🤖</Box>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
                  AI-Powered Matching
                </Typography>
                <Typography color="text.secondary">
                  Advanced algorithms analyze compatibility based on sector, stage, and investment criteria 
                  to ensure the best possible matches.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-5px)' },
                borderRadius: 3,
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box sx={{ fontSize: '3rem', mb: 2 }}>⚡</Box>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
                  Real-time Connections
                </Typography>
                <Typography color="text.secondary">
                  Instant messaging and notifications when mutual matches are discovered. 
                  Connect with the right people at the right time.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-5px)' },
                borderRadius: 3,
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box sx={{ fontSize: '3rem', mb: 2 }}>📊</Box>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
                  Smart Analytics
                </Typography>
                <Typography color="text.secondary">
                  Get insights into your profile performance, matching statistics, and 
                  optimize your strategy for better results.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Call to Action Section */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            mt: 8, 
            p: 6,
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(229, 57, 53, 0.1))',
            borderRadius: 4,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#1976d2' }}>
            Ready to Fuel Your Growth?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
            Join thousands of startups and investors already using Fuel Fund
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#e53935',
                '&:hover': { bgcolor: '#c62828' },
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Start Matching Today
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing;
