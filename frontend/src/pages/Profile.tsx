import React from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  MenuItem,
  Chip,
  Stack,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';

interface StartupProfileData {
  name: string;
  description: string;
  stage: string;
  sectors: string[];
  valuation: number;
  arr: number;
}

interface InvestorProfileData {
  name: string;
  description: string;
  type: string;
  sectorFocus: string[];
  checkSizeMin: number;
  checkSizeMax: number;
  stagePreferences: string[];
}

const stages = [
  'pre-seed',
  'seed',
  'series-a',
  'series-b',
  'series-c',
  'growth',
];

const sectors = [
  'fintech',
  'ai',
  'saas',
  'healthtech',
  'edtech',
  'ecommerce',
  'marketplace',
  'enterprise',
  'consumer',
  'hardware',
];

const investorTypes = [
  'angel',
  'vc',
  'corporate',
  'accelerator',
  'family-office',
];

const Profile = () => {
  const { user } = useAuth();
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const { register, handleSubmit, control, formState: { errors } } = useForm<StartupProfileData & InvestorProfileData>();

  const onSubmit = async (data: StartupProfileData & InvestorProfileData) => {
    try {
      setError('');
      setSuccess('');
      
      // TODO: Send profile data to API
      console.log('Profile data:', data);
      
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                {...register('name' as const, { required: 'Name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                {...register('description' as const, { required: 'Description is required' })}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>

            {user?.userType === 'startup' ? (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Stage"
                    {...register('stage' as const, { required: 'Stage is required' })}
                    error={!!errors.stage}
                    helperText={errors.stage?.message}
                  >
                    {stages.map((stage) => (
                      <MenuItem key={stage} value={stage}>
                        {stage}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="sectors"
                    control={control}
                    defaultValue={[]}
                    rules={{ required: 'Select at least one sector' }}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        select
                        label="Sectors"
                        SelectProps={{ multiple: true }}
                        error={!!errors.sectors}
                        helperText={errors.sectors?.message}
                        {...field}
                      >
                        {sectors.map((sector) => (
                          <MenuItem key={sector} value={sector}>
                            {sector}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Valuation ($)"
                    {...register('valuation' as const, { 
                      required: 'Valuation is required',
                      min: { value: 0, message: 'Must be positive' }
                    })}
                    error={!!errors.valuation}
                    helperText={errors.valuation?.message}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Annual Recurring Revenue ($)"
                    {...register('arr' as const, { 
                      required: 'ARR is required',
                      min: { value: 0, message: 'Must be positive' }
                    })}
                    error={!!errors.arr}
                    helperText={errors.arr?.message}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Investor Type"
                    {...register('type' as const, { required: 'Type is required' })}
                    error={!!errors.type}
                    helperText={errors.type?.message}
                  >
                    {investorTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="sectorFocus"
                    control={control}
                    defaultValue={[]}
                    rules={{ required: 'Select at least one sector' }}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        select
                        label="Sector Focus"
                        SelectProps={{ multiple: true }}
                        error={!!errors.sectorFocus}
                        helperText={errors.sectorFocus?.message}
                        {...field}
                      >
                        {sectors.map((sector) => (
                          <MenuItem key={sector} value={sector}>
                            {sector}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Minimum Check Size ($)"
                    {...register('checkSizeMin' as const, { 
                      required: 'Minimum check size is required',
                      min: { value: 0, message: 'Must be positive' }
                    })}
                    error={!!errors.checkSizeMin}
                    helperText={errors.checkSizeMin?.message}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Maximum Check Size ($)"
                    {...register('checkSizeMax' as const, { 
                      required: 'Maximum check size is required',
                      min: { value: 0, message: 'Must be positive' }
                    })}
                    error={!!errors.checkSizeMax}
                    helperText={errors.checkSizeMax?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="stagePreferences"
                    control={control}
                    defaultValue={[]}
                    rules={{ required: 'Select at least one stage' }}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        select
                        label="Stage Preferences"
                        SelectProps={{ multiple: true }}
                        error={!!errors.stagePreferences}
                        helperText={errors.stagePreferences?.message}
                        {...field}
                      >
                        {stages.map((stage) => (
                          <MenuItem key={stage} value={stage}>
                            {stage}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
