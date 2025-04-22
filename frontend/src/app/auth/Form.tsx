'use client';

import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

type AuthMode = 'login' | 'signup';

type FormProps = {
  mode?: AuthMode;
  onSubmit?: (data: FormData) => void;
  onToggleMode?: () => void;
};

export default function AuthForm({
  mode = 'login',
  onSubmit,
  onToggleMode,
}: FormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      onSubmit?.(formData);
      // In a real app, you would handle auth here
    } catch (err) {
      setError(
        typeof err === 'string'
          ? err
          : 'Authentication failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: 4, width: '100%', maxWidth: 'md', mx: 'auto' }}
    >
      <Typography variant="h5" component="h2" align="center" gutterBottom>
        {mode === 'login' ? 'Log In' : 'Sign Up'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          {mode === 'signup' && (
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus={mode === 'signup'}
            />
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus={mode === 'login'}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete={
              mode === 'login' ? 'current-password' : 'new-password'
            }
          />

          {mode === 'signup' && (
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ mt: 2, mb: 2 }}
          >
            {isLoading ? 'Loading...' : mode === 'login' ? 'Log In' : 'Sign Up'}
          </Button>
        </Stack>
      </Box>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <Button onClick={onToggleMode} variant="text" size="small">
                Sign up
              </Button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Button onClick={onToggleMode} variant="text" size="small">
                Log in
              </Button>
            </>
          )}
        </Typography>
      </Box>
    </Paper>
  );
}
