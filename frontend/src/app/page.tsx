'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  Paper,
  Card,
  CardContent,
  CardActionArea,
  Chip,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/userAuth';
import defaultRecipes from '../../testdata/recipes.json';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TimerIcon from '@mui/icons-material/Timer';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Home() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();

  const handleAuthNavigation = (mode: 'login' | 'signup') => {
    router.push(`/auth?mode=${mode}`);
  };

  const handleRecipeNavigation = (recipeId: string) => {
    router.push(`/recipes/${recipeId}`);
  };

  const handleViewAllRecipes = () => {
    router.push('/recipes');
  };

  const recentRecipes = defaultRecipes.slice(0, 3);

  if (user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            background: 'linear-gradient(to right, #f7f9fc, #e8f4ea)',
            border: '1px solid #e0e0e0',
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box
              sx={{
                flexGrow: 1,
                flexBasis: { xs: '100%', md: 'calc(66.666% - 8px)' },
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 'bold', color: '#2E7D32' }}
              >
                Welcome back, {user.name || 'User'}!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: '#333' }}>
                Your personalized meal planning assistant is ready to help you
                plan delicious meals and organize your grocery shopping.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 1 }}
                onClick={() => router.push('/recipes/add')}
              >
                Add New Recipe
              </Button>
            </Box>
            <Box
              sx={{
                flexBasis: { xs: '100%', md: 'calc(33.333% - 8px)' },
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  p: 2,
                  background: 'white',
                  borderRadius: '50%',
                  width: 180,
                  height: 180,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                <RestaurantIcon
                  sx={{
                    fontSize: 100,
                    color: theme.palette.primary.main,
                    opacity: 0.8,
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Recipe Section */}
        <Box sx={{ mb: 6 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              Recent Recipes
            </Typography>
            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={handleViewAllRecipes}
              sx={{ textTransform: 'none' }}
            >
              View All
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {recentRecipes.map((recipe) => (
              <Box
                key={recipe.recipeID}
                sx={{
                  flexBasis: {
                    xs: '100%',
                    sm: 'calc(50% - 12px)',
                    md: 'calc(33.333% - 16px)',
                  },
                }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => handleRecipeNavigation(recipe.recipeID)}
                  >
                    <Box
                      sx={{
                        height: 140,
                        backgroundColor: getRecipeColor(recipe.recipeID),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <RestaurantIcon sx={{ fontSize: 60, color: 'white' }} />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        noWrap
                      >
                        {recipe.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          height: 40,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {recipe.description}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {recipe.recipeTags &&
                          recipe.recipeTags
                            .slice(0, 2)
                            .map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            ))}
                        {recipe.recipeTags && recipe.recipeTags.length > 2 && (
                          <Chip
                            label={`+${recipe.recipeTags.length - 2}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Quick Links */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box
            sx={{
              flexBasis: {
                xs: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 16px)',
              },
            }}
          >
            <Paper
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BookmarkIcon
                  sx={{ mr: 1, color: theme.palette.primary.main }}
                />
                <Typography variant="h6">My Recipe Book</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Access your personal collection of recipes and favorites
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => router.push('/recipes')}
              >
                View Recipes
              </Button>
            </Paper>
          </Box>
          <Box
            sx={{
              flexBasis: {
                xs: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 16px)',
              },
            }}
          >
            <Paper
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimerIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6">Meal Planning</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Plan your weekly meals and organize your cooking schedule
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => router.push('/planning')}
              >
                Start Planning
              </Button>
            </Paper>
          </Box>
          <Box
            sx={{
              flexBasis: {
                xs: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 16px)',
              },
            }}
          >
            <Paper
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginRight: 8 }}
                >
                  <path
                    d="M7 18C8.1 18 9 18.9 9 20S8.1 22 7 22 5 21.1 5 20 5.9 18 7 18M17 18C18.1 18 19 18.9 19 20S18.1 22 17 22 15 21.1 15 20 15.9 18 17 18M7.2 14.8V14.7L8.1 13H15.5C16.2 13 16.9 12.6 17.2 12L21.1 5L19.4 4L15.5 11H8.5L4.3 2H1V4H3L6.6 11.6L5.2 14C5.1 14.3 5 14.6 5 15C5 16.1 5.9 17 7 17H19V15H7.4C7.3 15 7.2 14.9 7.2 14.8Z"
                    fill="#2E7D32"
                  />
                </svg>
                <Typography variant="h6">Grocery List</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Generate shopping lists from your selected recipes
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => router.push('/grocery')}
              >
                View Groceries
              </Button>
            </Paper>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        top: 0,
        left: 0,
        marginLeft: 'calc(-1 * (100vw - 100%) / 2)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1,
          },
        }}
      >
        <Image
          src="/backgrounds/ingredients_background.jpg"
          alt="Food ingredients on dark background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          px: 3,
          py: 8,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            color: 'white',
            fontWeight: 'bold',
            mb: 3,
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
          }}
        >
          Simplify Your Recipe Book
        </Typography>

        <Typography
          variant="h5"
          sx={{
            color: 'white',
            mb: 6,
            maxWidth: '800px',
            lineHeight: 1.5,
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            fontSize: { xs: '1.2rem', md: '1.5rem' },
          }}
        >
          Store recipes, create shopping lists, and plan your meals in one
          place.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => handleAuthNavigation('signup')}
            sx={{
              fontSize: '1.1rem',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Get Started
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

function getRecipeColor(id: string) {
  const colors = [
    '#4CAF50', // Green
    '#F57C00', // Orange
    '#5C6BC0', // Indigo
    '#26A69A', // Teal
    '#EC407A', // Pink
  ];

  const colorIndex = parseInt(id.slice(-1), 10) % colors.length;
  return colors[colorIndex];
}
