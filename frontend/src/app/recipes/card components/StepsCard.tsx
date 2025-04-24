import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from '@mui/material';

interface Step {
  id: string;
  instruction: string;
}

interface StepsCardProps {
  steps: Step[];
}

export default function StepsCard({ steps }: StepsCardProps) {
  const [checkedSteps, setCheckedSteps] = useState<string[]>([]);

  const handleToggleStep = (id: string) => {
    setCheckedSteps((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  if (!steps || steps.length === 0) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            Preparation Steps
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No steps listed for this recipe.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
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
