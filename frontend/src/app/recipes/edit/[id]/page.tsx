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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/userAuth';
import IngredientsModal from '../../add/IngredientsModal';
import StepsModal from '../../add/StepsModal';
import IngredientCard from '../../components/card components/IngredientCard';
import StepsCard from '../../components/card components/StepsCard';
import { recipeApi } from '@/lib/recipeapi';

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

export default function EditRecipe() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const recipeId = params?.id as string;

  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [ingredientsModalOpen, setIngredientsModalOpen] = useState(false);
  const [stepsModalOpen, setStepsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipe = await recipeApi.getRecipe(recipeId);
        if (recipe.author !== user?._id) {
          router.push('/recipes');
          return;
        }
        setRecipeName(recipe.title);
        setDescription(recipe.description);
        setSelectedTags(recipe.tags || []);
        setIngredients(
          recipe.ingredients.map((ing, idx) => ({
            ...ing,
            id: `${ing.name}-${idx}`,
            amount: ing.amount.toString(),
          }))
        );
        setSteps(
          recipe.steps.map((step, idx) => ({
            id: `step-${idx}`,
            instruction: step.instruction,
          }))
        );
        setLoading(false);
      } catch (err) {
        setError('Failed to load recipe');
        setLoading(false);
      }
    };

    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId, user, router]);

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
      setError('You must be logged in to edit a recipe');
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

      const formattedIngredients = ingredients.map((ing) => ({
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        type: ing.type,
      }));

      const formattedSteps = steps.map((step, index) => ({
        number: index + 1,
        instruction: step.instruction,
      }));

      await recipeApi.updateRecipe(recipeId, {
        title: recipeName,
        description,
        ingredients: formattedIngredients,
        steps: formattedSteps,
        tags: selectedTags,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(`/recipes/${recipeId}`);
      }, 1500);
    } catch (err) {
      setError('Failed to update recipe. Please try again.');
      console.error('Error updating recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await recipeApi.deleteRecipe(recipeId);
      router.push('/recipes');
    } catch (err) {
      setDeleting(false);
      setError('Failed to delete recipe.');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Loading recipe...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={handleCancel} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Edit Recipe
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

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Recipe updated successfully!
              </Alert>
            )}

            <Box
              sx={{
                mt: 3,
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
              }}
            >
              <Button
                color="error"
                variant="outlined"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>

              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                Save Changes
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      <IngredientsModal
        open={ingredientsModalOpen}
        onClose={() => setIngredientsModalOpen(false)}
        ingredients={ingredients}
        onSaveIngredients={setIngredients}
      />

      <StepsModal
        open={stepsModalOpen}
        onClose={() => setStepsModalOpen(false)}
        steps={steps}
        onSaveSteps={setSteps}
      />
    </Container>
  );
}
