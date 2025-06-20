'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAuth } from '@/context/userAuth';
import AuthForm from './Form';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'login' || modeParam === 'signup') {
      setMode(modeParam);
    }
  }, [searchParams]);

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography component="h1" variant="h4" fontWeight="bold">
            MealMate
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {mode === 'login'
              ? 'Sign in to your account'
              : 'Create your account'}
          </Typography>
          <Typography variant="body1" color="text.error" sx={{ mt: 1 }}>
            DO NOT PUT REAL PASSWORDS HERE, HERE IS NO SECURITY.
            <br />
            SIGN IN USING A TEST ACCOUNT:
            <br />
            Email: test@test.com
            <br />
            Password: Password123
          </Typography>
        </Box>

        <AuthForm mode={mode} onToggleMode={toggleMode} />
      </Box>
    </Container>
  );
}
