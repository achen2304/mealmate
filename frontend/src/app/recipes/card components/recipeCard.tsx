import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from '@mui/material';

export interface RecipeCardProps {
  recipeID: string;
  name: string;
  description: string;
  onClick?: (recipeID: string) => void;
}

export default function RecipeCard({
  recipeID,
  name,
  description,
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
        <Typography variant="body2" color="text.secondary">
          {description.length > 100
            ? `${description.substring(0, 100)}...`
            : description}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button size="small" onClick={handleClick}>
          View Recipe
        </Button>
      </CardActions>
    </Card>
  );
}
