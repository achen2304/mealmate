'use client';

import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  OutlinedInput,
  SelectChangeEvent,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import IngredientsModal from './IngredientsModal';
import StepsModal from './StepsModal';
import IngredientCard from '../card components/IngredientCard';
import StepsCard from '../card components/StepsCard';
import { recipeApi } from '../../../lib/recipeapi';
import { useAuth } from '../../../context/userAuth';

const RECIPE_TAGS = [
  'breakfast',
  'lunch',
  'dinner',
  'dessert',
  'heavy',
  'light',
  'quick',
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
];

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  type: string;
}

interface Step {
  id: string;
  instruction: string;
}

export default function AddRecipe() {
  const router = useRouter();
  const { user } = useAuth();
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [ingredientsModalOpen, setIngredientsModalOpen] = useState(false);
  const [stepsModalOpen, setStepsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleTagChange = (event: SelectChangeEvent<typeof selectedTags>) => {
    const {
      target: { value },
    } = event;
    setSelectedTags(typeof value === 'string' ? value.split(',') : value);
  };

  const handleIngredients = () => {
    setIngredientsModalOpen(true);
  };

  const handleSteps = () => {
    setStepsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create a recipe');
      return;
    }

    if (
      !recipeName ||
      !description ||
      ingredients.length === 0 ||
      steps.length === 0
    ) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Convert ingredients to the correct format
      const formattedIngredients = ingredients.map((ing) => ({
        name: ing.name,
        amount: parseFloat(ing.amount),
        unit: ing.unit,
        type: ing.type,
      }));

      // Convert steps to the correct format
      const formattedSteps = steps.map((step, index) => ({
        number: index + 1,
        instruction: step.instruction,
      }));

      const recipeData = {
        title: recipeName,
        description,
        ingredients: formattedIngredients,
        steps: formattedSteps,
        tags: selectedTags,
        author: user._id,
      };

      await recipeApi.createRecipe(recipeData);
      setSuccess(true);

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push('/recipes');
      }, 1500);
    } catch (err) {
      setError('Failed to create recipe. Please try again.');
      console.error('Error creating recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={handleCancel} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Add New Recipe
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              required
              fullWidth
              id="recipeName"
              label="Recipe Name"
              name="recipeName"
              autoFocus
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              disabled={loading}
            />

            <TextField
              required
              fullWidth
              multiline
              rows={3}
              id="description"
              label="Description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />

            <FormControl fullWidth>
              <InputLabel id="tags-label">Tags</InputLabel>
              <Select
                labelId="tags-label"
                id="tags"
                multiple
                value={selectedTags}
                onChange={handleTagChange}
                input={<OutlinedInput label="Tags" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
                disabled={loading}
              >
                {RECIPE_TAGS.map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Ingredients</Typography>
                <Button
                  variant="outlined"
                  onClick={handleIngredients}
                  disabled={loading}
                >
                  {ingredients.length > 0
                    ? 'Edit Ingredients'
                    : 'Add Ingredients'}
                </Button>
              </Box>

              {ingredients.length > 0 ? (
                <IngredientCard ingredients={ingredients} />
              ) : (
                <Typography color="text.secondary">
                  No ingredients added yet
                </Typography>
              )}
            </Box>

            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Steps</Typography>
                <Button
                  variant="outlined"
                  onClick={handleSteps}
                  disabled={loading}
                >
                  {steps.length > 0 ? 'Edit Steps' : 'Add Steps'}
                </Button>
              </Box>

              {steps.length > 0 ? (
                <StepsCard steps={steps} />
              ) : (
                <Typography color="text.secondary">
                  No steps added yet
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                mt: 2,
              }}
            >
              <Button onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  loading ||
                  !recipeName ||
                  !description ||
                  ingredients.length === 0 ||
                  steps.length === 0
                }
              >
                {loading ? 'Saving...' : 'Save Recipe'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      <IngredientsModal
        open={ingredientsModalOpen}
        onClose={() => setIngredientsModalOpen(false)}
        ingredients={ingredients}
        onSaveIngredients={(ingredients: Ingredient[]) =>
          setIngredients(ingredients)
        }
      />

      <StepsModal
        open={stepsModalOpen}
        onClose={() => setStepsModalOpen(false)}
        steps={steps}
        onSaveSteps={setSteps}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={1500}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Recipe created successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}
