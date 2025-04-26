import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

interface IngredientsModalProps {
  open: boolean;
  onClose: () => void;
  ingredients: Ingredient[];
  onSaveIngredients: (ingredients: Ingredient[]) => void;
}

const UNITS = ['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'oz', 'lb', 'pinch'];

export default function IngredientsModal({
  open,
  onClose,
  ingredients,
  onSaveIngredients,
}: IngredientsModalProps) {
  const [currentIngredients, setCurrentIngredients] =
    useState<Ingredient[]>(ingredients);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('');

  const handleAddIngredient = () => {
    if (name.trim() === '' || amount.trim() === '') return;

    const ingredient: Ingredient = {
      id: Date.now().toString(),
      name: name.trim(),
      amount: amount.trim(),
      unit: unit,
    };

    setCurrentIngredients([...currentIngredients, ingredient]);
    setName('');
    setAmount('');
    setUnit('');
  };

  const handleDeleteIngredient = (id: string) => {
    setCurrentIngredients(
      currentIngredients.filter((ingredient) => ingredient.id !== id)
    );
  };

  const handleSave = () => {
    onSaveIngredients(currentIngredients);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Recipe Ingredients</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Add the ingredients needed for this recipe
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Ingredient name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ flexGrow: 2 }}
            />
            <TextField
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              sx={{ flexGrow: 1 }}
              placeholder="e.g. 1, 1/2, 1/4"
            />
            <FormControl sx={{ flexGrow: 1 }}>
              <InputLabel id="unit-label">Unit</InputLabel>
              <Select
                labelId="unit-label"
                value={unit}
                label="Unit"
                onChange={(e) => setUnit(e.target.value)}
              >
                {UNITS.map((u) => (
                  <MenuItem key={u} value={u}>
                    {u}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleAddIngredient}
              sx={{ alignSelf: 'center' }}
            >
              Add
            </Button>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Ingredients:
          </Typography>

          {currentIngredients.length === 0 ? (
            <Typography color="text.secondary">
              No ingredients added yet
            </Typography>
          ) : (
            <List>
              {currentIngredients.map((ingredient) => (
                <ListItem
                  key={ingredient.id}
                  sx={{
                    bgcolor: 'background.paper',
                    mb: 1,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <ListItemText
                    primary={`${ingredient.amount} ${ingredient.unit} ${ingredient.name}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteIngredient(ingredient.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Ingredients
        </Button>
      </DialogActions>
    </Dialog>
  );
}
