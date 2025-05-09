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
import { recipeApi } from '../../../lib/recipeapi';

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  type: string;
}

interface Step {
  number: number;
  instruction: string;
}

interface Recipe {
  _id: string;
  title: string;
  description: string;
  tags?: string[];
  ingredients: Ingredient[];
  steps: Step[];
  author?: string;
}

export default function Recipe() {
  const router = useRouter();
  const params = useParams();
  const recipeId = params?.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recipeId) return;

    setLoading(true);
    setError(null);

    recipeApi
      .getRecipe(recipeId)
      .then((data) => {
        setRecipe(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Recipe not found');
        setLoading(false);
      });
  }, [recipeId]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Loading recipe...</Typography>
      </Container>
    );
  }

  if (error || !recipe) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography color="error">{error || 'Recipe not found'}</Typography>
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
          {recipe.title}
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="body1" paragraph>
          {recipe.description}
        </Typography>

        {recipe.tags && recipe.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {recipe.tags.map((tag) => (
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
        ingredients={recipe.ingredients.map((ing, idx) => ({
          ...ing,
          id: `${ing.name}-${idx}`,
        }))}
        recipeId={recipe._id}
      />

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Preparation Steps
      </Typography>
      <StepsCard
        steps={recipe.steps.map((step, idx) => ({
          ...step,
          id: `step-${step.number ?? idx}`,
        }))}
        recipeId={recipe._id}
      />
    </Container>
  );
}
