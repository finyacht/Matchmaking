import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Box,
} from '@mui/material';
import { Message as MessageIcon } from '@mui/icons-material';

interface Match {
  id: string;
  mutualScore: number;
  startup: {
    id: string;
    name: string;
    stage: string;
    sectors: string[];
    valuation: number;
  };
  investor: {
    id: string;
    name: string;
    type: string;
    sectorFocus: string[];
    checkSizeMin: number;
    checkSizeMax: number;
  };
}

const Matches = () => {
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // TODO: Fetch matches from API
    const mockMatches: Match[] = [
      {
        id: '1',
        mutualScore: 85,
        startup: {
          id: 's1',
          name: 'TechFlow AI',
          stage: 'seed',
          sectors: ['fintech', 'ai'],
          valuation: 5000000,
        },
        investor: {
          id: 'i1',
          name: 'Future Ventures',
          type: 'vc',
          sectorFocus: ['fintech', 'ai', 'saas'],
          checkSizeMin: 250000,
          checkSizeMax: 2000000,
        },
      },
      // Add more mock matches as needed
    ];
    setMatches(mockMatches);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (matches.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>No matches yet. Keep swiping to find potential matches!</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Matches
      </Typography>

      <Grid container spacing={3}>
        {matches.map((match) => (
          <Grid item xs={12} md={6} key={match.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {match.startup.name} & {match.investor.name}
                  </Typography>
                  <Chip
                    label={`${match.mutualScore}% Match`}
                    color="primary"
                    size="small"
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Startup
                    </Typography>
                    <Typography variant="body2">
                      Stage: {match.startup.stage}
                    </Typography>
                    <Typography variant="body2">
                      Valuation: ${(match.startup.valuation / 1000000).toFixed(1)}M
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      {match.startup.sectors.map((sector) => (
                        <Chip
                          key={sector}
                          label={sector}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Investor
                    </Typography>
                    <Typography variant="body2">
                      Type: {match.investor.type}
                    </Typography>
                    <Typography variant="body2">
                      Check Size: ${match.investor.checkSizeMin / 1000}K - ${match.investor.checkSizeMax / 1000}K
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      {match.investor.sectorFocus.map((sector) => (
                        <Chip
                          key={sector}
                          label={sector}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    component={RouterLink}
                    to={`/messages?match=${match.id}`}
                    variant="contained"
                    startIcon={<MessageIcon />}
                  >
                    Message
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Matches;
