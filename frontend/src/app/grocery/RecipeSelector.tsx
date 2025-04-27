import React from 'react';
import {
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

interface Recipe {
  recipeID: string;
  name: string;
  description: string;
  recipeTags?: string[];
  ingredients: Ingredient[];
}

interface Ingredient {
  id: string;
  name: string;
  amount: string | number;
  unit: string;
}

interface RecipeSelectorProps {
  recipes: Recipe[];
  selectedRecipes: string[];
  onRecipeToggle: (recipeId: string) => void;
}

export default function RecipeSelector({
  recipes,
  selectedRecipes,
  onRecipeToggle,
}: RecipeSelectorProps) {
  if (!recipes || recipes.length === 0) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            Your Recipes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No recipes available. Add some recipes first.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Your Recipes
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List dense disablePadding>
          {recipes.map((recipe) => (
            <ListItem
              key={recipe.recipeID}
              disablePadding
              sx={{
                py: 0.5,
                cursor: 'pointer',
              }}
              onClick={() => onRecipeToggle(recipe.recipeID)}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Checkbox
                  edge="start"
                  checked={selectedRecipes.includes(recipe.recipeID)}
                  onChange={(e) => {
                    e.stopPropagation();
                    onRecipeToggle(recipe.recipeID);
                  }}
                  size="small"
                  onClick={() => onRecipeToggle(recipe.recipeID)}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" component="span">
                    {recipe.name}
                  </Typography>
                }
                secondary={
                  recipe.description.length > 50
                    ? `${recipe.description.substring(0, 50)}...`
                    : recipe.description
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
