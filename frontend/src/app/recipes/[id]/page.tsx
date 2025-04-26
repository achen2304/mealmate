'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter, useParams } from 'next/navigation';
import IngredientCard from '../card components/IngredientCard';
import StepsCard from '../card components/StepsCard';
import defaultRecipes from '../../../../testdata/recipes.json';
import ingredientsData from '../../../../testdata/ingredients.json';
interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

interface Step {
  id: string;
  instruction: string;
}

interface Recipe {
  recipeID: string;
  name: string;
  description: string;
  recipeTags?: string[];
  ingredients: Ingredient[];
  steps: Step[];
}

export default function Recipe() {
  const router = useRouter();
  const params = useParams();
  const recipeId = params?.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (!recipeId) return;

    const foundRecipe = defaultRecipes.find((r) => r.recipeID === recipeId);

    if (foundRecipe) {
      const formattedRecipe: Recipe = {
        recipeID: foundRecipe.recipeID,
        name: foundRecipe.name,
        description: foundRecipe.description,
        recipeTags: foundRecipe.recipeTags,
        ingredients: foundRecipe.ingredients.map((ing) => ({
          id: ing.ingredientID,
          name: getIngredientName(ing.ingredientID),
          amount: String(ing.amount),
          unit: ing.unit,
        })),
        steps: foundRecipe.directions.map((dir) => ({
          id: `step-${dir.step}`,
          instruction: dir.direction,
        })),
      };

      setRecipe(formattedRecipe);
    }
  }, [recipeId]);

  const getIngredientName = (id: string): string => {
    const ingredient = ingredientsData.find((ing) => ing.ingredientID === id);
    return ingredient ? ingredient.name : 'Unknown Ingredient';
  };

  const handleBack = () => {
    router.back();
  };

  if (!recipe) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Loading recipe...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {recipe.name}
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="body1" paragraph>
          {recipe.description}
        </Typography>

        {recipe.recipeTags && recipe.recipeTags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {recipe.recipeTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                color="primary"
              />
            ))}
          </Box>
        )}
      </Paper>

      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Ingredients
      </Typography>
      <IngredientCard
        ingredients={recipe.ingredients}
        recipeId={recipe.recipeID}
      />

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Preparation Steps
      </Typography>
      <StepsCard steps={recipe.steps} recipeId={recipe.recipeID} />
    </Container>
  );
}
