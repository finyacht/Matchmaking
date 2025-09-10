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
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Connect with the Right Investors
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 4 }}
          >
            Our AI-powered platform matches startups with investors based on
            sector fit, stage alignment, and mutual preferences.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              size="large"
              color="primary"
            >
              Get Started
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              size="large"
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Smart Matching
                </Typography>
                <Typography color="text.secondary">
                  Our AI algorithm considers multiple factors to ensure the best possible matches
                  between startups and investors.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Easy Communication
                </Typography>
                <Typography color="text.secondary">
                  Built-in messaging system for seamless communication once you've matched.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Profile Analytics
                </Typography>
                <Typography color="text.secondary">
                  Get insights into your profile performance and matching statistics.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Landing;
