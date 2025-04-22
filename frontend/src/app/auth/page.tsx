'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AuthForm from './Form';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'login' || modeParam === 'signup') {
      setMode(modeParam);
    }
  }, [searchParams]);

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log(`${mode} attempt for user: ${email}`);

    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh',
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
        </Box>

        <AuthForm
          mode={mode}
          onToggleMode={toggleMode}
          onSubmit={handleSubmit}
        />
      </Box>
    </Container>
  );
}
