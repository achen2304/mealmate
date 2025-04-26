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
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import IngredientsModal from './IngredientsModal';
import StepsModal from './StepsModal';
import IngredientCard from '../card components/IngredientCard';
import StepsCard from '../card components/StepsCard';

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
}

interface Step {
  id: string;
  instruction: string;
}

export default function AddRecipe() {
  const router = useRouter();
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // New state for ingredients and steps
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [ingredientsModalOpen, setIngredientsModalOpen] = useState(false);
  const [stepsModalOpen, setStepsModalOpen] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipeName || !description) {
      return;
    }

    const newRecipe = {
      recipeID: Date.now().toString(),
      name: recipeName,
      description,
      recipeTags: selectedTags,
      ingredients: ingredients,
      steps: steps,
    };

    console.log('New recipe:', newRecipe);

    router.push('/recipes');
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
                <Button variant="outlined" onClick={handleIngredients}>
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
                <Button variant="outlined" onClick={handleSteps}>
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
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!recipeName || !description}
              >
                Save Recipe
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
