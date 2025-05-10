'use client';

import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

export default function AddRecipeButton() {
  const router = useRouter();

  const handleAddRecipe = () => {
    router.push('/recipes/add');
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddRecipe}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 'medium',
          boxShadow: '0px 2px 8px rgba(46, 125, 50, 0.2)',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(46, 125, 50, 0.3)',
          },
        }}
      >
        Add Recipe
      </Button>
    </Box>
  );
}
