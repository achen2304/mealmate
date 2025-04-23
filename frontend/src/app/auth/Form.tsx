'use client';

import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '@/context/userAuth';

type AuthMode = 'login' | 'signup';

type FormProps = {
  mode?: AuthMode;
  onToggleMode?: () => void;
};

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;
const PASSWORD_MIN_LENGTH = 8;

// Field validation interfaces
interface ValidationState {
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
  name: string | null;
}

export default function AuthForm({ mode = 'login', onToggleMode }: FormProps) {
  const { login, signup, isLoading, error: authError, clearError } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  // Track field values for validation
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });

  // Track validation errors for each field
  const [validationErrors, setValidationErrors] = useState<ValidationState>({
    email: null,
    password: null,
    confirmPassword: null,
    name: null,
  });

  // Clear auth errors when toggling modes
  useEffect(() => {
    clearError();
    setFormError(null);
  }, [mode, clearError]);

  // Handle field changes and perform validation
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update form values
    setFormValues({
      ...formValues,
      [name]: value,
    });

    // Reset specific field error when user types
    setValidationErrors({
      ...validationErrors,
      [name]: null,
    });
  };

  // Validate individual fields
  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!EMAIL_REGEX.test(value))
          return 'Please enter a valid email address';
        return null;

      case 'password':
        if (!value) return 'Password is required';
        if (value.length < PASSWORD_MIN_LENGTH)
          return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
        if (!/[A-Z]/.test(value))
          return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(value))
          return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(value))
          return 'Password must contain at least one number';
        return null;

      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formValues.password) return 'Passwords do not match';
        return null;

      case 'name':
        if (mode === 'signup' && !value.trim()) return 'Name is required';
        return null;

      default:
        return null;
    }
  };

  // Validate all fields before submission
  const validateForm = (): boolean => {
    const errors: ValidationState = {
      email: validateField('email', formValues.email),
      password: validateField('password', formValues.password),
      confirmPassword:
        mode === 'signup'
          ? validateField('confirmPassword', formValues.confirmPassword)
          : null,
      name: mode === 'signup' ? validateField('name', formValues.name) : null,
    };

    setValidationErrors(errors);

    // Form is valid if no errors exist
    return !Object.values(errors).some((error) => error !== null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate all fields before submitting
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    setFormError(null);

    try {
      if (mode === 'login') {
        await login(formValues.email, formValues.password);
      } else {
        await signup(formValues.email, formValues.password, formValues.name);
      }
    } catch (err) {
      // Auth errors will be handled by the context
      // Any additional form-specific errors can be handled here
      setFormError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
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

      {(formError || authError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError || authError}
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
              value={formValues.name}
              onChange={handleFieldChange}
              error={!!validationErrors.name}
              helperText={validationErrors.name}
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
            value={formValues.email}
            onChange={handleFieldChange}
            error={!!validationErrors.email}
            helperText={validationErrors.email}
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
            value={formValues.password}
            onChange={handleFieldChange}
            error={!!validationErrors.password}
            helperText={validationErrors.password}
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
              value={formValues.confirmPassword}
              onChange={handleFieldChange}
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
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
