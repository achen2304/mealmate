import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Button,
} from '@mui/material';

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

interface IngredientCardProps {
  ingredients: Ingredient[];
  recipeId?: string;
}

export default function IngredientCard({
  ingredients,
  recipeId,
}: IngredientCardProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const storageKey = recipeId ? `recipe-${recipeId}-ingredients` : null;

  useEffect(() => {
    if (isClient && storageKey) {
      try {
        const savedChecked = localStorage.getItem(storageKey);
        if (savedChecked) {
          const parsedChecked = JSON.parse(savedChecked);
          if (Array.isArray(parsedChecked)) {
            setCheckedIngredients(parsedChecked);
          }
        }
      } catch (e) {
        console.error('Failed to load ingredients from localStorage:', e);
      }
    }
  }, [storageKey, isClient]);

  useEffect(() => {
    if (isClient && storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(checkedIngredients));
        console.log(
          `Saved ingredients to localStorage: ${storageKey}`,
          checkedIngredients
        );
      } catch (e) {
        console.error('Failed to save ingredients to localStorage:', e);
      }
    }
  }, [checkedIngredients, storageKey, isClient]);

  const handleToggleIngredient = (id: string) => {
    setCheckedIngredients((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleClearAll = () => {
    setCheckedIngredients([]);
  };

  if (!ingredients || ingredients.length === 0) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" component="div" gutterBottom>
              Ingredients
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            No ingredients listed for this recipe.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" component="div" gutterBottom>
            Ingredients
          </Typography>
          {checkedIngredients.length > 0 && (
            <Button size="small" onClick={handleClearAll} color="primary">
              Clear All
            </Button>
          )}
        </Box>
        <List dense disablePadding>
          {ingredients.map((ingredient) => (
            <ListItem
              key={ingredient.id}
              disablePadding
              sx={{
                py: 0.5,
                opacity: checkedIngredients.includes(ingredient.id) ? 0.6 : 1,
                cursor: 'pointer',
              }}
              onClick={() => handleToggleIngredient(ingredient.id)}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Checkbox
                  edge="start"
                  checked={checkedIngredients.includes(ingredient.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleToggleIngredient(ingredient.id);
                  }}
                  size="small"
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    component="span"
                    sx={{
                      textDecoration: checkedIngredients.includes(ingredient.id)
                        ? 'line-through'
                        : 'none',
                    }}
                  >
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
