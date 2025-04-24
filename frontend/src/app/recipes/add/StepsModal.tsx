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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

interface Step {
  id: string;
  instruction: string;
}

interface StepsModalProps {
  open: boolean;
  onClose: () => void;
  steps: Step[];
  onSaveSteps: (steps: Step[]) => void;
}

export default function StepsModal({
  open,
  onClose,
  steps,
  onSaveSteps,
}: StepsModalProps) {
  const [currentSteps, setCurrentSteps] = useState<Step[]>(steps);
  const [newStep, setNewStep] = useState('');

  const handleAddStep = () => {
    if (newStep.trim() === '') return;

    const step: Step = {
      id: Date.now().toString(),
      instruction: newStep.trim(),
    };

    setCurrentSteps([...currentSteps, step]);
    setNewStep('');
  };

  const handleDeleteStep = (id: string) => {
    setCurrentSteps(currentSteps.filter((step) => step.id !== id));
  };

  const handleSave = () => {
    onSaveSteps(currentSteps);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Recipe Steps</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Add the steps to prepare this recipe
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              label="Step instruction"
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              multiline
              rows={2}
            />
            <Button
              variant="contained"
              onClick={handleAddStep}
              sx={{ alignSelf: 'flex-end' }}
            >
              Add
            </Button>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Steps:
          </Typography>

          {currentSteps.length === 0 ? (
            <Typography color="text.secondary">No steps added yet</Typography>
          ) : (
            <List>
              {currentSteps.map((step, index) => (
                <ListItem
                  key={step.id}
                  sx={{
                    bgcolor: 'background.paper',
                    mb: 1,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <ListItemText
                    primary={`Step ${index + 1}`}
                    secondary={step.instruction}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteStep(step.id)}
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
          Save Steps
        </Button>
      </DialogActions>
    </Dialog>
  );
}
