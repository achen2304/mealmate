'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, Box, useTheme } from '@mui/material';
import RecipeSelector from './RecipeSelector';
import GroceryList from './GroceryList';
import { recipeApi } from '../../lib/recipeapi';
import { useAuth } from '../../context/userAuth';

interface Ingredient {
  id: string;
  name: string;
  amount: string | number;
  unit: string;
  quantities?: Array<{ amount: string | number; unit: string }>;
}

interface Recipe {
  recipeID: string;
  name: string;
  description: string;
  recipeTags?: string[];
  ingredients: Ingredient[];
}

export default function Grocery() {
  const theme = useTheme();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const [groceryList, setGroceryList] = useState<Ingredient[]>([]);

  useEffect(() => {
    if (!user) {
      setRecipes([]);
      return;
    }
    recipeApi.getUserRecipes(user._id).then((backendRecipes) => {
      // Map backend recipes to the expected structure
      const mappedRecipes: Recipe[] = backendRecipes.map((r) => ({
        recipeID: r._id,
        name: r.title,
        description: r.description,
        recipeTags: r.tags,
        ingredients: r.ingredients.map((ing, idx) => ({
          id: `${ing.name}-${idx}`,
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
        })),
      }));
      setRecipes(mappedRecipes);
    });
  }, [user]);

  useEffect(() => {
    const ingredientsById: Record<string, Ingredient> = {};

    recipes
      .filter((recipe) => selectedRecipes.includes(recipe.recipeID))
      .forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
          if (!ingredientsById[ingredient.id]) {
            ingredientsById[ingredient.id] = {
              ...ingredient,
              quantities: [
                { amount: ingredient.amount, unit: ingredient.unit },
              ],
            };
          } else {
            const existing = ingredientsById[ingredient.id];
            if (!existing.quantities) {
              existing.quantities = [
                { amount: existing.amount, unit: existing.unit },
              ];
            }
            existing.quantities.push({
              amount: ingredient.amount,
              unit: ingredient.unit,
            });
          }
        });
      });

    setGroceryList(Object.values(ingredientsById));
  }, [selectedRecipes, recipes]);

  const handleRecipeToggle = (recipeId: string) => {
    setSelectedRecipes((prev) => {
      if (prev.includes(recipeId)) {
        return prev.filter((id) => id !== recipeId);
      } else {
        return [...prev, recipeId];
      }
    });
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
        Grocery Planner
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          minHeight: '70vh',
        }}
      >
        <Box sx={{ flex: { xs: '1', md: '0 0 40%' } }}>
          <RecipeSelector
            recipes={recipes}
            selectedRecipes={selectedRecipes}
            onRecipeToggle={handleRecipeToggle}
          />
        </Box>

        <Box sx={{ flex: { xs: '1', md: '0 0 60%' } }}>
          <GroceryList ingredients={groceryList} />
        </Box>
      </Box>
    </Container>
  );
}
