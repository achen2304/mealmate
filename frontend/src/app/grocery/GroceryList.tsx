import React, { useState, useMemo } from 'react';
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
}

interface CombinedIngredient {
  id: string;
  name: string;
  amounts: (string | number)[];
  originalIds: string[];
}

interface GroceryListProps {
  ingredients: Ingredient[];
}

export default function GroceryList({ ingredients }: GroceryListProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);

  const combinedIngredients = useMemo(() => {
    const combined: { [key: string]: CombinedIngredient } = {};

    ingredients.forEach((ingredient) => {
      const normalizedName = ingredient.name.toLowerCase().trim();

      if (!combined[normalizedName]) {
        combined[normalizedName] = {
          id: ingredient.id,
          name: ingredient.name,
          amounts: [ingredient.amount],
          originalIds: [ingredient.id],
        };
      } else {
        combined[normalizedName].amounts.push(ingredient.amount);
        combined[normalizedName].originalIds.push(ingredient.id);
      }
    });

    return Object.values(combined);
  }, [ingredients]);

  const sortedIngredients = useMemo(() => {
    return [...combinedIngredients].sort((a, b) => {
      const aChecked = a.originalIds.every((id) =>
        checkedIngredients.includes(id)
      );
      const bChecked = b.originalIds.every((id) =>
        checkedIngredients.includes(id)
      );
      if (aChecked !== bChecked) {
        return aChecked ? 1 : -1;
      }
      return a.name.localeCompare(b.name);
    });
  }, [combinedIngredients, checkedIngredients]);

  const handleToggleIngredient = (originalIds: string[]) => {
    setCheckedIngredients((prev) => {
      const allChecked = originalIds.every((id) => prev.includes(id));
      if (allChecked) {
        return prev.filter((id) => !originalIds.includes(id));
      } else {
        return [...prev, ...originalIds.filter((id) => !prev.includes(id))];
      }
    });
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
          {sortedIngredients.map((ingredient) => {
            const isChecked = ingredient.originalIds.every((id) =>
              checkedIngredients.includes(id)
            );

            return (
              <ListItem
                key={ingredient.id}
                disablePadding
                sx={{
                  py: 0.5,
                  opacity: isChecked ? 0.6 : 1,
                  cursor: 'pointer',
                }}
                onClick={() => handleToggleIngredient(ingredient.originalIds)}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Checkbox
                    edge="start"
                    checked={isChecked}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleToggleIngredient(ingredient.originalIds);
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
                        textDecoration: isChecked ? 'line-through' : 'none',
                      }}
                    >
                      {`${ingredient.name} (${ingredient.amounts.join(' + ')})`}
                    </Typography>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
}
