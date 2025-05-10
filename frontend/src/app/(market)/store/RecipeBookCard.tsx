'use client';

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  useTheme,
} from '@mui/material';
import { ShoppingCart, CheckCircle } from '@mui/icons-material';
import { StoreItem } from '@/lib/storeapi';

interface RecipeBookCardProps {
  book: StoreItem;
  onAddToCart: (book: StoreItem) => void;
  onShowDetails: (book: StoreItem) => void;
  isInCart: boolean;
}

export default function RecipeBookCard({
  book,
  onAddToCart,
  onShowDetails,
  isInCart,
}: RecipeBookCardProps) {
  const theme = useTheme();

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
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" gutterBottom>
          {book.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          by {book.author}
          </Typography>
        <Typography variant="h5" color="primary" sx={{ my: 2 }}>
          ${book.cost.toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {book.description[0]}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
        <Button
            variant="outlined"
            fullWidth
            onClick={() => onShowDetails(book)}
            sx={{ borderRadius: 2 }}
        >
            View Details
        </Button>
        <Button
          variant="contained"
            fullWidth
            startIcon={isInCart ? <CheckCircle /> : <ShoppingCart />}
            onClick={() => onAddToCart(book)}
            color={isInCart ? 'success' : 'primary'}
            sx={{ borderRadius: 2 }}
        >
            {isInCart ? 'Remove' : 'Add to Cart'}
        </Button>
        </Box>
      </CardActions>
    </Card>
  );
}
