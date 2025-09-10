import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormData>({
    defaultValues: {
      email: 'startup@demo.com',
      password: 'password'
    }
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
    }
  };

  const handleDemoLogin = (userType: 'startup' | 'investor') => {
    if (userType === 'startup') {
      setValue('email', 'startup@demo.com');
      setValue('password', 'password');
    } else {
      setValue('email', 'investor@demo.com');
      setValue('password', 'password');
    }
  };

  return (
    <Box>
      {/* Condensed Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 4,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <Box
              component="img"
              src="/fuel-fund-logo.svg"
              alt="Fuel Fund Logo"
              sx={{
                width: 60,
                height: 60,
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              FUEL FUND
            </Typography>
          </Box>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              mt: 1,
              fontWeight: 300,
            }}
          >
            Sign in to your account
          </Typography>
        </Container>
      </Box>

      {/* Login Form */}
      <Container component="main" maxWidth="sm" sx={{ mt: -2 }}>
        <Card
          sx={{
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            borderRadius: 4,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Demo Credentials Section */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Demo Accounts (for testing purposes):
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Chip
                  label="Use Startup Demo"
                  variant="outlined"
                  color="primary"
                  onClick={() => handleDemoLogin('startup')}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="Use Investor Demo"
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDemoLogin('investor')}
                  sx={{ cursor: 'pointer' }}
                />
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0, #0d47a1)',
                  },
                }}
              >
                Sign In
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Link component={RouterLink} to="/signup" variant="body2" sx={{ fontWeight: 500 }}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
