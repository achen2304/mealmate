'use client';

import { Container, Typography, Box, Divider } from '@mui/material';
import RecipeCard from './card components/recipeCard';
import SearchBar from '../../components/SearchBar';
import defaultRecipes from '../../../testdata/recipes.json';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import FilterButton from './button components/filterButton';
import AddRecipeButton from './button components/addRecipeButton';
import { useTheme } from '@mui/material/styles';

export default function Recipes() {
  const router = useRouter();
  const theme = useTheme();
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
      const lowercasedSearch = searchTerm.toLowerCase().trim();
      const searchWords = lowercasedSearch.split(/\s+/);

      results = results.filter((recipe) => {
        const recipeName = recipe.name.toLowerCase();
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
        selectedTags.some((tag) => recipe.recipeTags?.includes(tag))
      );
    }

    setFilteredRecipes(results);
  };

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
        Your Recipes
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
              recipeTags={recipe.recipeTags}
              onClick={handleRecipeClick}
            />
          </Box>
        ))}
      </Box>
    </Container>
  );
}
