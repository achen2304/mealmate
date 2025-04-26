'use client';

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
import {
  AutoStories,
  ShoppingCart,
  Info,
  CheckCircle,
} from '@mui/icons-material';
import { useCart } from '@/context/cartContext';

interface RecipeBookCardProps {
  product: {
    itemID: string;
    itemName: string;
    author: string;
    itemType: string;
    cost: number;
    recipesId?: number[];
    description?: string | string[];
  };
  onShowDetails: (product: any) => void;
  onAddToCart: (product: any) => void;
}

export default function RecipeBookCard({
  product,
  onShowDetails,
  onAddToCart,
}: RecipeBookCardProps) {
  const theme = useTheme();
  const { isItemInCart } = useCart();

  const handleShowDetails = () => {
    onShowDetails(product);
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
          backgroundColor: getProductColor(product.itemID),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AutoStories sx={{ fontSize: 60, color: 'white' }} />
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" sx={{ mb: 0 }}>
          {product.itemName}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            by {product.author}
          </Typography>
          <Chip
            size="small"
            label={`${product.recipesId?.length} recipes`}
            color="secondary"
            variant="outlined"
          />
        </Box>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {Array.isArray(product.description)
            ? product.description.join(', ')
            : product.description}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
          ${product.cost.toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          p: 2,
          pt: 0,
          display: 'flex',
          gap: 1,
          justifyContent: 'space-between',
        }}
      >
        <Button
          size="small"
          startIcon={<Info />}
          onClick={handleShowDetails}
          sx={{ width: '40%' }}
        >
          Details
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{ borderRadius: 2, width: '60%' }}
          startIcon={
            isItemInCart(product.itemID) ? <CheckCircle /> : <ShoppingCart />
          }
          onClick={() => onAddToCart(product)}
          color={isItemInCart(product.itemID) ? 'success' : 'primary'}
        >
          {isItemInCart(product.itemID) ? 'Remove' : 'Add to Cart'}
        </Button>
      </CardActions>
    </Card>
  );
}

function getProductColor(id: string) {
  const colors = [
    '#4CAF50', // Green
    '#F57C00', // Orange
    '#5C6BC0', // Indigo
    '#26A69A', // Teal
    '#EC407A', // Pink
  ];

  const colorIndex = parseInt(id.slice(-1), 10) % colors.length;
  return colors[colorIndex];
}
