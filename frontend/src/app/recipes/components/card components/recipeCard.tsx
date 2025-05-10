import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  useTheme,
  Chip,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';

export interface RecipeCardProps {
  recipeID: string;
  name: string;
  description: string;
  recipeTags?: string[];
  onClick?: (recipeID: string) => void;
}

export default function RecipeCard({
  recipeID,
  name,
  description,
  recipeTags = [],
  onClick,
}: RecipeCardProps) {
  const theme = useTheme();

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
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Box
        sx={{
          height: 140,
          backgroundColor: getRecipeColor(recipeID),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <RestaurantIcon sx={{ fontSize: 60, color: 'white' }} />
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
          {name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            height: 40,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {description.length > 100
            ? `${description.substring(0, 100)}...`
            : description}
        </Typography>

        {recipeTags && recipeTags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {recipeTags.slice(0, 2).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{ fontSize: '0.7rem' }}
              />
            ))}
            {recipeTags.length > 2 && (
              <Chip
                label={`+${recipeTags.length - 2}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            )}
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="outlined"
          fullWidth
          sx={{ borderRadius: 2 }}
          onClick={handleClick}
        >
          View Recipe
        </Button>
      </CardActions>
    </Card>
  );
}

function getRecipeColor(id: string) {
  const colors = [
    '#4CAF50', // Green
    '#F57C00', // Orange
    '#5C6BC0', // Indigo
    '#26A69A', // Teal
    '#EC407A', // Pink
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
}
