'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CircularProgress, Box, Typography, Button } from '@mui/material';

// Redirect page for the app for protected routes

export default function Redirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const to = searchParams.get('to');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 2,
      }}
    >
      <h1>Please log in to access all features</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push('/')}
      >
        Back to home
      </Button>
    </Box>
  );
}
