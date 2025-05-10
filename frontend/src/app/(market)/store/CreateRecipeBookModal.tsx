import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Autocomplete,
  Chip,
  useTheme,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { storeApi } from '@/lib/storeapi';
import { recipeApi } from '@/lib/recipeapi';
import { useAuth } from '@/context/userAuth';

interface CreateRecipeBookModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateRecipeBookModal({
  open,
  onClose,
  onSuccess,
}: CreateRecipeBookModalProps) {
  const theme = useTheme();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const [availableRecipes, setAvailableRecipes] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      const fetchRecipes = async () => {
        try {
          const recipes = await recipeApi.getAllRecipes();
          const userRecipes = user?._id
            ? recipes.filter((r) => r.author === user._id)
            : [];
          setAvailableRecipes(
            userRecipes.map((r) => ({ id: r._id, title: r.title }))
          );
        } catch (err) {
          console.error('Error fetching recipes:', err);
          setError('Failed to load recipes. Please try again.');
        }
      };
      fetchRecipes();
    }
  }, [open, user]);

  useEffect(() => {
    if (!open) {
      setName('');
      setDescription('');
      setCost('');
      setSelectedRecipes([]);
      setError('');
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name || !description || !cost || selectedRecipes.length === 0) {
      setError('Please fill in all fields and select at least one recipe');
      return;
    }

    if (!user?.name) {
      setError(
        'Please set your name in your profile before creating a recipe book'
      );
      return;
    }

    setLoading(true);
    setError('');

    try {
      await storeApi.createItem({
        name,
        type: 'Recipe Book',
        description: [description],
        author: user.name,
        cost: parseFloat(cost),
        recipesId: selectedRecipes,
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to create recipe book. Please try again.');
      console.error('Error creating recipe book:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5">Create New Recipe Book</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Book Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            required
          />
          <TextField
            label="Price"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            type="number"
            fullWidth
            required
            InputProps={{
              startAdornment: '$',
            }}
          />
          <Autocomplete
            multiple
            options={availableRecipes}
            getOptionLabel={(option) => option.title}
            value={availableRecipes.filter((r) =>
              selectedRecipes.includes(r.id)
            )}
            onChange={(_, newValue) => {
              setSelectedRecipes(newValue.map((v) => v.id));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Recipes"
                required
                error={!!(error && selectedRecipes.length === 0)}
                helperText={
                  error && selectedRecipes.length === 0
                    ? 'Please select at least one recipe'
                    : ''
                }
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.title}
                  {...getTagProps({ index })}
                  key={option.id}
                />
              ))
            }
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ borderRadius: 2 }}
        >
          {loading ? 'Creating...' : 'Create Recipe Book'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
