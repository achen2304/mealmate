'use client';

import { Container, Typography, Box, Divider } from '@mui/material';
import RecipeCard from './card components/recipeCard';
import SearchBar from '../../components/SearchBar';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import FilterButton from './button components/filterButton';
import AddRecipeButton from './button components/addRecipeButton';
import { useTheme } from '@mui/material/styles';
import { recipeApi, Recipe } from '../../lib/recipeapi';
import { useAuth } from '../../context/userAuth';

export default function Recipes() {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuth();
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, [user]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      let recipes: Recipe[];

      if (user) {
        recipes = await recipeApi.getUserRecipes(user._id);
      } else {
        recipes = await recipeApi.getAllRecipes();
      }

      setAllRecipes(recipes);
      setFilteredRecipes(recipes);
    } catch (err) {
      setError('Failed to fetch recipes');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedTags, allRecipes]);

  const handleRecipeClick = (recipeId: string) => {
    router.push(`/recipes/${recipeId}`);
  };

  const handleSearch = (searchText: string) => {
    setSearchTerm(searchText);
  };

  const handleFilterChange = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const applyFilters = () => {
    let results = [...allRecipes];

    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase().trim();
      const searchWords = lowercasedSearch.split(/\s+/);

      results = results.filter((recipe) => {
        const recipeName = recipe.title.toLowerCase();
        const recipeNameWords = recipeName.split(/\s+/);

        return searchWords.every((searchWord) =>
          recipeNameWords.some((recipeWord) =>
            recipeWord.startsWith(searchWord)
          )
        );
      });
    }

    if (selectedTags.length > 0) {
      results = results.filter((recipe) =>
        selectedTags.some((tag) => recipe.tags.includes(tag))
      );
    }

    setFilteredRecipes(results);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading recipes...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{
          fontWeight: 'bold',
          color: theme.palette.primary.main,
        }}
      >
        {user ? 'Your Recipes' : 'All Recipes'}
      </Typography>
      <Divider sx={{ my: 2 }} />

      {/* Search and Actions Bar */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'center',
          mb: 4,
        }}
      >
        <Box sx={{ flexGrow: 1, maxWidth: '600px' }}>
          <SearchBar onSearch={handleSearch} placeholder="Search recipes..." />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FilterButton onFilterChange={handleFilterChange} />
          {user && <AddRecipeButton />}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 3,
        }}
      >
        {filteredRecipes.map((recipe) => (
          <Box key={recipe._id}>
            <RecipeCard
              recipeID={recipe._id}
              name={recipe.title}
              description={recipe.description}
              recipeTags={recipe.tags}
              onClick={handleRecipeClick}
            />
          </Box>
        ))}
      </Box>
    </Container>
  );
}
