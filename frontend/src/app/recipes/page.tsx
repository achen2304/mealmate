'use client';

import { Container, Typography, Box, Paper } from '@mui/material';
import RecipeCard from './recipeCard';
import RecipeSearch from '../../components/SearchBar';
import defaultRecipes from '../../../testdata/recipes.json';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import FilterButton from './filterButton';
import AddRecipeButton from './addRecipeButton';

export default function Recipes() {
  const router = useRouter();
  const [allRecipes, setAllRecipes] = useState(defaultRecipes);
  const [filteredRecipes, setFilteredRecipes] = useState(defaultRecipes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
      const lowercasedSearch = searchTerm.toLowerCase();
      results = results.filter((recipe) =>
        recipe.name
          .toLowerCase()
          .split(' ')
          .some((word) => word.startsWith(lowercasedSearch))
      );
    }

    if (selectedTags.length > 0) {
      results = results.filter((recipe) =>
        selectedTags.some((tag) => recipe.recipeTags?.includes(tag))
      );
    }

    setFilteredRecipes(results);
  };

  const handleAddRecipe = (newRecipe: any) => {
    const updatedRecipes = [...allRecipes, newRecipe];
    setAllRecipes(updatedRecipes);

    setTimeout(() => applyFilters(), 0);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Your Recipes
      </Typography>

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
          <RecipeSearch onSearch={handleSearch} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FilterButton onFilterChange={handleFilterChange} />
          <AddRecipeButton />
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
          <Box key={recipe.recipeID}>
            <RecipeCard
              recipeID={recipe.recipeID}
              name={recipe.name}
              description={recipe.description}
              cookTime={20}
              onClick={handleRecipeClick}
            />
          </Box>
        ))}
      </Box>
    </Container>
  );
}
