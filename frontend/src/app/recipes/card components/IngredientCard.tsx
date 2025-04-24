import React, { useState } from 'react';
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
} from '@mui/material';

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

interface IngredientCardProps {
  ingredients: Ingredient[];
}

export default function IngredientCard({ ingredients }: IngredientCardProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);

  const handleToggleIngredient = (id: string) => {
    setCheckedIngredients((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  if (!ingredients || ingredients.length === 0) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            Ingredients
          </Typography>
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
