'use client';

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Paper,
  Stack,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '@/context/userAuth';

type AuthMode = 'login' | 'signup';

type FormProps = {
  mode?: AuthMode;
  onToggleMode?: () => void;
};

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
}

export default function AuthForm({ mode = 'login', onToggleMode }: FormProps) {
  const { login, signup, isLoading, error: authError, clearError } = useAuth();
  const [formKey, setFormKey] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setError,
    clearErrors,
  } = useForm<AuthFormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
    },
  });

  const password = watch('password');

  useEffect(() => {
    clearError();
    clearErrors();
    reset();
    setFormKey((prev) => prev + 1);
  }, [mode, clearError, clearErrors, reset]);

  const onSubmit: SubmitHandler<AuthFormData> = async (data) => {
    try {
      if (mode === 'login') {
        await login(data.email, data.password);
      } else {
        if (data.name) {
          await signup(data.email, data.password, data.name);
        }
      }
    } catch (err) {
      if (mode === 'login') {
        setError('root', {
          message: 'Username or password is incorrect',
        });
      } else {
        setError('root', {
          message: err instanceof Error ? err.message : 'Registration failed',
        });
      }
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: 4, width: '100%', maxWidth: 'md', mx: 'auto' }}
    >
      <Typography variant="h5" component="h1" align="center" gutterBottom>
        {mode === 'login' ? 'Log In' : 'Sign Up'}
      </Typography>

      {(errors.root?.message || authError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.root?.message || authError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2} key={formKey}>
          {mode === 'signup' && (
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              autoComplete="name"
              autoFocus={mode === 'signup'}
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register('name', {
                required: 'Name is required',
              })}
            />
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            autoFocus={mode === 'login'}
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/,
                message: 'Please enter a valid email address',
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
            autoComplete={
              mode === 'login' ? 'current-password' : 'new-password'
            }
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              ...(mode === 'signup' && {
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                validate: {
                  hasUppercase: (value) =>
                    /[A-Z]/.test(value) ||
                    'Password must contain at least one uppercase letter',
                  hasLowercase: (value) =>
                    /[a-z]/.test(value) ||
                    'Password must contain at least one lowercase letter',
                  hasNumber: (value) =>
                    /[0-9]/.test(value) ||
                    'Password must contain at least one number',
                },
              }),
            })}
          />

          {mode === 'signup' && (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ mt: 2, mb: 2, position: 'relative' }}
          >
            {isLoading ? (
              <>
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
                Processing...
              </>
            ) : mode === 'login' ? (
              'Log In'
            ) : (
              'Sign Up'
            )}
          </Button>
        </Stack>
      </Box>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2">
          {mode === 'login' ? (
            <>
              Don't have an account?
              <Button onClick={onToggleMode} variant="text" size="small">
                Sign up
              </Button>
            </>
          ) : (
            <>
              Already have an account?
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
