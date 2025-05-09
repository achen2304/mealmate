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
import { useCart } from '@/context/cartContext';
import { StoreItem } from '@/lib/storeapi';
import { recipeApi, Recipe as BackendRecipe } from '@/lib/recipeapi';
import { useAuth } from '@/context/userAuth';
import { storeApi } from '@/lib/storeapi';

interface RecipeDetailsModalProps {
  open: boolean;
  onClose: () => void;
  product: StoreItem;
  onAddToCart: (product: StoreItem) => void;
  isInCart: boolean;
  onDelete?: () => void;
}

export default function RecipeDetailsModal({
  open,
  onClose,
  product,
  onAddToCart,
  isInCart,
  onDelete,
}: RecipeDetailsModalProps) {
  const theme = useTheme();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<BackendRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isItemInCart } = useCart();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (open && product && product.recipesId && product.recipesId.length > 0) {
      setLoading(true);
      setError('');
      const fetchRecipes = async () => {
        try {
          const fetched = await Promise.all(
            product.recipesId!.map((id) => recipeApi.getRecipe(id))
          );
          setRecipes(fetched);
        } catch (err) {
          setError('Failed to load recipes.');
          setRecipes([]);
        } finally {
          setLoading(false);
        }
      };
      fetchRecipes();
    } else {
      setRecipes([]);
      setLoading(false);
    }
  }, [open, product]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await storeApi.deleteItem(product._id);
      if (onDelete) onDelete();
      onClose();
    } catch (err) {
      // Optionally show error
      setDeleting(false);
    }
  };

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
          backgroundColor: getProductColor(product._id),
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
            {product.name}
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
              <React.Fragment key={recipe._id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={recipe.title}
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
                          {recipe.description?.substring(0, 100)}
                          {recipe.description && recipe.description.length > 100
                            ? '...'
                            : ''}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {recipe.tags &&
                            recipe.tags
                              .slice(0, 3)
                              .map((tag: string) => (
                                <Chip
                                  key={tag}
                                  size="small"
                                  label={tag}
                                  sx={{ fontSize: '0.7rem' }}
                                  component="span"
                                />
                              ))}
                          {(recipe as any).cookTime && (
                            <Chip
                              size="small"
                              icon={<AccessTime />}
                              label={`${(recipe as any).cookTime} min`}
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
        {user?.name === product.author && (
          <Button
            onClick={handleDelete}
            color="error"
            disabled={deleting}
            sx={{ mr: 1 }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        )}
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button
          variant="contained"
          color={isInCart ? 'success' : 'primary'}
          startIcon={isInCart ? <CheckCircle /> : <ShoppingCart />}
          onClick={() => onAddToCart(product)}
        >
          {isInCart ? 'Remove' : 'Add to Cart'}
        </Button>
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
