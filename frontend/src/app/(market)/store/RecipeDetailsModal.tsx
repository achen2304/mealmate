'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  useTheme,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Close,
  AccessTime,
  ShoppingCart,
  CheckCircle,
} from '@mui/icons-material';
import defaultRecipes from '../../../../testdata/recipes.json';
import { useCart } from '@/context/cartContext';

interface Recipe {
  recipeID: string;
  name: string;
  description: string;
  recipeTags?: string[];
  cookTime?: number;
}

interface RecipeDetailsModalProps {
  open: boolean;
  onClose: () => void;
  product: {
    itemID: string;
    itemName: string;
    author: string;
    itemType: string;
    cost: number;
    recipesId?: number[];
    description?: string | string[];
  } | null;
  onAddToCart: (product: any) => void;
}

export default function RecipeDetailsModal({
  open,
  onClose,
  product,
  onAddToCart,
}: RecipeDetailsModalProps) {
  const theme = useTheme();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { isItemInCart } = useCart();

  useEffect(() => {
    if (open && product) {
      setLoading(true);

      const includedRecipes = defaultRecipes.filter((recipe) =>
        product.recipesId?.includes(parseInt(recipe.recipeID))
      );

      setRecipes(includedRecipes);
      setLoading(false);
    }
  }, [open, product]);

  if (!product) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
          backgroundColor: getProductColor(product.itemID),
          color: 'white',
          py: 0.5,
        }}
      >
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="div">
            {product.itemName}
          </Typography>

          <Typography
            variant="body2"
            component="div"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            by {product.author}
          </Typography>
          <Typography variant="body1" component="div" sx={{ mb: 1 }}>
            {Array.isArray(product.description)
              ? product.description.join(' ')
              : product.description}
          </Typography>
          <Typography
            variant="h6"
            component="div"
            color="primary"
            sx={{ mb: 2 }}
          >
            ${product.cost.toFixed(2)}
          </Typography>
        </Box>

        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          Included Recipes:
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List sx={{ bgcolor: 'background.paper' }}>
            {recipes.map((recipe, index) => (
              <React.Fragment key={recipe.recipeID}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={recipe.name}
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Box
                          component="span"
                          sx={{
                            display: 'block',
                            mb: 1,
                            color: 'text.secondary',
                            fontSize: '0.875rem',
                          }}
                        >
                          {recipe.description.substring(0, 100)}
                          {recipe.description.length > 100 ? '...' : ''}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {recipe.recipeTags &&
                            recipe.recipeTags
                              .slice(0, 3)
                              .map((tag) => (
                                <Chip
                                  key={tag}
                                  size="small"
                                  label={tag}
                                  sx={{ fontSize: '0.7rem' }}
                                  component="span"
                                />
                              ))}
                          {recipe.cookTime && (
                            <Chip
                              size="small"
                              icon={<AccessTime />}
                              label={`${recipe.cookTime} min`}
                              sx={{ fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < recipes.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        {product && (
          <Button
            variant="contained"
            color={isItemInCart(product.itemID) ? 'success' : 'primary'}
            startIcon={
              isItemInCart(product.itemID) ? <CheckCircle /> : <ShoppingCart />
            }
            onClick={() => onAddToCart(product)}
          >
            {isItemInCart(product.itemID) ? 'Remove' : 'Add to Cart'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

function getProductColor(id: string) {
  const colors = [
    '#4CAF50', // Green
    '#F57C00', // Orange
    '#5C6BC0', // Indigo
    '#26A69A', // Teal
    '#EC407A', // Pink
  ];

  const colorIndex = parseInt(id.slice(-1), 10) % colors.length;
  return colors[colorIndex];
}
