import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from '@mui/material';
import {
  Search as SearchIcon,
  Favorite as MatchesIcon,
  Message as MessageIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <SearchIcon sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
                    <Button
                      component={RouterLink}
                      to="/feed"
                      variant="contained"
                      fullWidth
                    >
                      Browse Feed
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <MatchesIcon sx={{ fontSize: 40, mb: 1, color: 'secondary.main' }} />
                    <Button
                      component={RouterLink}
                      to="/matches"
                      variant="contained"
                      color="secondary"
                      fullWidth
                    >
                      View Matches
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <MessageIcon sx={{ fontSize: 40, mb: 1, color: 'success.main' }} />
                    <Button
                      component={RouterLink}
                      to="/messages"
                      variant="contained"
                      color="success"
                      fullWidth
                    >
                      Messages
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <PersonIcon sx={{ fontSize: 40, mb: 1, color: 'info.main' }} />
                    <Button
                      component={RouterLink}
                      to="/profile"
                      variant="contained"
                      color="info"
                      fullWidth
                    >
                      Edit Profile
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Stats */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Your Stats
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Profile Views
                  </Typography>
                  <Typography variant="h4">
                    24
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Matches
                  </Typography>
                  <Typography variant="h4">
                    3
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Messages
                  </Typography>
                  <Typography variant="h4">
                    12
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Match Rate
                  </Typography>
                  <Typography variant="h4">
                    68%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
