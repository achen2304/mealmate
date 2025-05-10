import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Box,
  Button,
} from '@mui/material';

// Steps card for the app

interface Step {
  id: string;
  instruction: string;
}

interface StepsCardProps {
  steps: Step[];
  recipeId?: string;
}

export default function StepsCard({ steps, recipeId }: StepsCardProps) {
  const [checkedSteps, setCheckedSteps] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const storageKey = recipeId ? `recipe-${recipeId}-steps` : null;

  // Load the steps Status from localStorage
  useEffect(() => {
    if (isClient && storageKey) {
      try {
        const savedChecked = localStorage.getItem(storageKey);
        if (savedChecked) {
          const parsedChecked = JSON.parse(savedChecked);
          if (Array.isArray(parsedChecked)) {
            setCheckedSteps(parsedChecked);
          }
        }
      } catch (e) {
        console.error('Failed to load steps from localStorage:', e);
      }
    }
  }, [storageKey, isClient]);

  // Save the steps Status to localStorage if it changes
  useEffect(() => {
    if (isClient && storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(checkedSteps));
        console.log(`Saved steps to localStorage: ${storageKey}`, checkedSteps);
      } catch (e) {
        console.error('Failed to save steps to localStorage:', e);
      }
    }
  }, [checkedSteps, storageKey, isClient]);

  // Handle the toggle step for the app
  const handleToggleStep = (id: string) => {
    setCheckedSteps((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle the clear all for the app
  const handleClearAll = () => {
    setCheckedSteps([]);
  };

  // Render the steps card for the app if there are no steps
  if (!steps || steps.length === 0) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" component="div" gutterBottom>
              Preparation Steps
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            No steps listed for this recipe.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Render the steps card for the app if there are steps
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mb: 2,
          }}
        >
          {checkedSteps.length > 0 && (
            <Button size="small" onClick={handleClearAll} color="primary">
              Clear All
            </Button>
          )}
        </Box>
        <List dense disablePadding>
          {steps.map((step, index) => (
            <ListItem
              key={step.id}
              disablePadding
              sx={{
                py: 0.5,
                opacity: checkedSteps.includes(step.id) ? 0.6 : 1,
                cursor: 'pointer',
              }}
              onClick={() => handleToggleStep(step.id)}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Checkbox
                  edge="start"
                  checked={checkedSteps.includes(step.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleToggleStep(step.id);
                  }}
                  onClick={() => handleToggleStep(step.id)}
                  size="small"
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    component="span"
                    sx={{
                      textDecoration: checkedSteps.includes(step.id)
                        ? 'line-through'
                        : 'none',
                    }}
                  >
                    {step.instruction}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textDecoration: checkedSteps.includes(step.id)
                        ? 'line-through'
                        : 'none',
                    }}
                  >
                    Step {index + 1}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
