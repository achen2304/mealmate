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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const RECIPE_TAGS = [
  'breakfast',
  'lunch',
  'dinner',
  'vegetarian',
  'quick',
  'dessert',
  'healthy',
  'italian',
  'protein',
];

export default function AddRecipe() {
  const router = useRouter();
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagChange = (event: SelectChangeEvent<typeof selectedTags>) => {
    const {
      target: { value },
    } = event;
    setSelectedTags(typeof value === 'string' ? value.split(',') : value);
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
      cookTime: parseInt(cookTime),
      recipeTags: selectedTags,
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

            <TextField
              required
              id="cookTime"
              label="Cook Time (minutes)"
              name="cookTime"
              type="number"
              inputProps={{ min: 1 }}
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              sx={{ maxWidth: '50%' }}
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
                disabled={!recipeName || !description || !cookTime}
              >
                Save Recipe
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
