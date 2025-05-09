'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  Paper,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/userAuth';
import defaultRecipes from '../../testdata/recipes.json';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Cart from '@mui/icons-material/ShoppingCart';
import RecipeCard from './recipes/card components/recipeCard';
import { useEffect, useState } from 'react';
import { recipeApi, Recipe as BackendRecipe } from '../lib/recipeapi';

export default function Home() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const [recentRecipes, setRecentRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      recipeApi
        .getUserRecipes(user._id)
        .then((recipes) => {
          // Sort by updatedAt or createdAt descending
          const sorted = [...recipes].sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          setRecentRecipes(sorted.slice(0, 3));
          setLoading(false);
        })
        .catch(() => {
          setRecentRecipes([]);
          setLoading(false);
        });
    } else {
      setRecentRecipes(defaultRecipes.slice(0, 3));
      setLoading(false);
    }
  }, [user]);

  const handleAuthNavigation = (mode: 'login' | 'signup') => {
    router.push(`/auth?mode=${mode}`);
  };

  const handleRecipeNavigation = (recipeId: string) => {
    router.push(`/recipes/${recipeId}`);
  };

  const handleViewAllRecipes = () => {
    router.push('/recipes');
  };

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
        {/* Quick Links */}
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 'bold', mb: 3 }}
        >
          Quick Links
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            mb: 3,
          }}
        >
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
                <Cart sx={{ mr: 1, color: theme.palette.primary.main }} />
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

          {loading ? (
            <Typography>Loading recipes...</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {recentRecipes.map((recipe) => (
                <Box
                  key={recipe._id || recipe.recipeID}
                  sx={{
                    flexBasis: {
                      xs: '100%',
                      sm: 'calc(50% - 12px)',
                      md: 'calc(33.333% - 16px)',
                    },
                  }}
                >
                  <RecipeCard
                    recipeID={recipe._id || recipe.recipeID}
                    name={recipe.title || recipe.name}
                    description={recipe.description}
                    recipeTags={recipe.tags || recipe.recipeTags}
                    onClick={handleRecipeNavigation}
                  />
                </Box>
              ))}
            </Box>
          )}
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
