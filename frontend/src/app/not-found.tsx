'use client'; // Need this because we're using MUI components

import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <Box>
      <Typography variant="h1">404</Typography>
      <Typography variant="h4">Page Not Found</Typography>
      <Button variant="contained" onClick={() => router.push('/')}>
        Go Home
      </Button>
    </Box>
  );
}
