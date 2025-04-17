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

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="lg">
      <Stack>
        <Typography variant="h1">Hello World</Typography>
      </Stack>
    </Container>
  );
}
