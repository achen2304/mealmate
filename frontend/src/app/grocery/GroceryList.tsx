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
  Divider,
} from '@mui/material';
 
interface Ingredient {
  id: string;
  name: string;
  amount: string | number;
  unit: string;
  quantities?: Array<{ amount: string | number; unit: string }>;
}

interface GroceryListProps {
  ingredients: Ingredient[];
}

export default function GroceryList({ ingredients }: GroceryListProps) {
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

  const formatQuantities = (ingredient: Ingredient): string => {
    if (!ingredient.quantities || ingredient.quantities.length === 0) {
      return `${ingredient.amount} ${ingredient.unit}`;
    }

    return ingredient.quantities
      .map((q) => `${q.amount} ${q.unit}`)
      .join(' + ');
  };

  if (!ingredients || ingredients.length === 0) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            Grocery List
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No ingredients to display. Please select recipes from the left.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Grocery List
        </Typography>
        <Divider sx={{ mb: 2 }} />
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
                    {`${ingredient.name} (${formatQuantities(ingredient)})`}
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
