'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/userAuth';

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const { user } = useAuth();

  const handleAuthNavigation = (mode: 'login' | 'signup') => {
    router.push(`/auth?mode=${mode}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {user ? (
        // Content for authenticated users
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to MealMate, {user.name || 'User'}!
          </Typography>
          <Typography variant="body1" paragraph>
            Your personalized meal planning assistant is ready to help you plan
            delicious meals and organize your grocery shopping.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Stack spacing={3} sx={{ mt: 4 }}>
            <Box>
              <Typography variant="h5" gutterBottom>
                Your Upcoming Meals
              </Typography>
              <Typography variant="body1" color="text.secondary">
                No meals planned yet. Start creating your meal plan!
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" gutterBottom>
                Recent Recipes
              </Typography>
              <Typography variant="body1" color="text.secondary">
                You haven't saved any recipes yet. Explore our recipe
                collection!
              </Typography>
            </Box>
          </Stack>
        </Box>
      ) : (
        // Content for non-authenticated users
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            Simplify Your Meal Planning
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            Plan your meals, find recipes, and generate shopping lists in one
            place.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => handleAuthNavigation('signup')}
            sx={{ mt: 2 }}
          >
            Get Started
          </Button>
        </Box>
      )}
    </Container>
  );
}
