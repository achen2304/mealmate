'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const handleAuthNavigation = (mode: 'login' | 'signup') => {
    router.push(`/auth?mode=${mode}`);
  };

  return (
    <Container maxWidth="lg">
      <Stack>
        <Typography variant="h1">Hello World</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleAuthNavigation('login')}
        >
          Login
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleAuthNavigation('signup')}
        >
          Signup
        </Button>
      </Stack>
    </Container>
  );
}
