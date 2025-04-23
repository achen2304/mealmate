import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from '@mui/material';

export interface RecipeCardProps {
  recipeID: string;
  name: string;
  description: string;
  cookTime: number;
  onClick?: (recipeID: string) => void;
}

export default function RecipeCard({
  recipeID,
  name,
  description,
  cookTime,
  onClick,
}: RecipeCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(recipeID);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 3,
          cursor: 'pointer',
        },
      }}
      onClick={handleClick}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {cookTime && (
            <Box
              sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                {cookTime} min
              </Typography>
            </Box>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description.length > 100
            ? `${description.substring(0, 100)}...`
            : description}
        </Typography>
      </CardContent>

      <CardActions>
        <Button size="small" onClick={handleClick}>
          View Recipe
        </Button>
      </CardActions>
    </Card>
  );
}
