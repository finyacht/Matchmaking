import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
} from '@mui/icons-material';

interface Profile {
  id: string;
  type: 'startup' | 'investor';
  name: string;
  description: string;
  compatibilityScore: number;
  sectors: string[];
  stage?: string;
  valuation?: number;
  arr?: number;
  investorType?: string;
  checkSizeMin?: number;
  checkSizeMax?: number;
}

const Feed = () => {
  const [currentProfile, setCurrentProfile] = React.useState<Profile | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // TODO: Fetch profiles from API
    const mockProfile: Profile = {
      id: '1',
      type: 'startup',
      name: 'TechFlow AI',
      description: 'AI-powered financial analytics platform',
      compatibilityScore: 85,
      sectors: ['fintech', 'ai'],
      stage: 'seed',
      valuation: 5000000,
      arr: 500000,
    };
    setCurrentProfile(mockProfile);
    setLoading(false);
  }, []);

  const handleSwipe = async (direction: 'left' | 'right') => {
    try {
      // TODO: Send swipe to API
      console.log(`Swiped ${direction} on profile ${currentProfile?.id}`);
      
      // Load next profile
      setLoading(true);
      // TODO: Fetch next profile from API
      setLoading(false);
    } catch (error) {
      console.error('Error handling swipe:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!currentProfile) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography>No more profiles to show. Check back later!</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              {currentProfile.name}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              {currentProfile.sectors.map((sector) => (
                <Chip
                  key={sector}
                  label={sector}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Stack>
            <Typography color="text.secondary" paragraph>
              {currentProfile.description}
            </Typography>
          </Box>

          {currentProfile.type === 'startup' && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Stage: {currentProfile.stage}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Valuation: ${(currentProfile.valuation! / 1000000).toFixed(1)}M
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                ARR: ${(currentProfile.arr! / 1000).toFixed(0)}K
              </Typography>
            </Box>
          )}

          {currentProfile.type === 'investor' && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Type: {currentProfile.investorType}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Check Size: ${currentProfile.checkSizeMin! / 1000}K - ${currentProfile.checkSizeMax! / 1000}K
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<ThumbDownIcon />}
              onClick={() => handleSwipe('left')}
            >
              Pass
            </Button>
            <Button
              variant="contained"
              color="success"
              endIcon={<ThumbUpIcon />}
              onClick={() => handleSwipe('right')}
            >
              Like
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="subtitle1" color="primary">
          {currentProfile.compatibilityScore}% Match
        </Typography>
      </Box>
    </Container>
  );
};

export default Feed;
