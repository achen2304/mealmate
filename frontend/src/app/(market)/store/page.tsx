'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  useTheme,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  AutoStories,
  Subscriptions,
  ShoppingCart,
  CheckCircle,
} from '@mui/icons-material';
import { useCart } from '@/context/cartContext';
import RecipeBookCard from './RecipeBookCard';
import RecipeDetailsModal from './RecipeDetailsModal';
import SearchBar from '@/components/SearchBar';

interface Product {
  itemID: string;
  itemName: string;
  itemType: string;
  cost: number;
  planType: string | null;
  description?: string[];
  author?: string;
  recipesId?: number[];
}

export default function StorePage() {
  const theme = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart, isItemInCart, removeFromCart } = useCart();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'info' | 'warning' | 'error'
  >('success');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipeBooks, setFilteredRecipeBooks] = useState<Product[]>([]);

  useEffect(() => {
    const recipeBooks = products.filter(
      (product) => product.itemType === 'Recipe Book'
    );

    if (searchTerm.trim() === '') {
      setFilteredRecipeBooks(recipeBooks);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase().trim();
      const searchWords = lowercasedSearch.split(/\s+/);

      const filtered = recipeBooks.filter((book) => {
        const bookTitle = book.itemName.toLowerCase();
        const authorName = book.author ? book.author.toLowerCase() : '';

        const titleWords = bookTitle.split(/\s+/);
        const authorWords = authorName.split(/\s+/);

        return searchWords.every(
          (searchWord) =>
            titleWords.some((titleWord) => titleWord.startsWith(searchWord)) ||
            authorWords.some((authorWord) => authorWord.startsWith(searchWord))
        );
      });

      setFilteredRecipeBooks(filtered);
    }
  }, [products, searchTerm]);

  const subscriptions = products.filter(
    (product) => product.itemType === 'Subscription'
  );

  const handleAddToCart = (product: Product) => {
    if (isItemInCart(product.itemID)) {
      removeFromCart(product.itemID);

      setSnackbarOpen(false);
      setTimeout(() => {
        setSnackbarMessage(`${product.itemName} removed from cart`);
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
      }, 100);
      return;
    }

    addToCart({
      itemID: product.itemID,
      itemName: product.itemName,
      itemType: product.itemType,
      cost: product.cost,
    });

    setSnackbarOpen(false);
    setTimeout(() => {
      setSnackbarMessage(`${product.itemName} added to cart`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }, 100);
  };

  const handleShowDetails = (product: Product) => {
    setSelectedProduct(product);
    setDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{
          fontWeight: 'bold',
          color: theme.palette.primary.main,
        }}
      >
        MealMate Store
      </Typography>
      <Divider sx={{ my: 2 }} />

      {/* Subscriptions Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Subscriptions
            sx={{
              mr: 1,
              color: theme.palette.primary.main,
            }}
          />
          <Typography variant="h4" component="h2">
            Premium Subscriptions
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Unlock all premium features with our subscription plans
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {subscriptions.map((product) => (
            <Box
              key={product.itemID}
              sx={{
                flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' },
              }}
            >
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
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h5" component="div">
                      {product.itemName}
                    </Typography>
                  </Box>
                  <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
                    ${product.cost.toFixed(2)}
                    <Typography component="span" variant="body2" sx={{ ml: 1 }}>
                      {product.planType}
                    </Typography>
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    {(product.description || []).map((feature, index) => (
                      <Typography
                        key={index}
                        component="div"
                        variant="body1"
                        sx={{ mb: 1 }}
                      >
                        • {feature}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ borderRadius: 2 }}
                    startIcon={
                      isItemInCart(product.itemID) ? (
                        <CheckCircle />
                      ) : (
                        <ShoppingCart />
                      )
                    }
                    onClick={() => handleAddToCart(product)}
                    color={isItemInCart(product.itemID) ? 'success' : 'primary'}
                  >
                    {isItemInCart(product.itemID) ? 'Remove' : 'Add to Cart'}
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Recipe Books Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AutoStories sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h4" component="h2">
            Recipe Books
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Explore our collection of curated recipe books
        </Typography>

        {/* Search Bar */}
        <Box sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search recipe books by title or author..."
          />
        </Box>

        {filteredRecipeBooks.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No recipe books found matching your search.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {filteredRecipeBooks.map((product) => (
              <Box
                key={product.itemID}
                sx={{
                  flexBasis: {
                    xs: '100%',
                    sm: 'calc(50% - 12px)',
                    md: 'calc(33.333% - 16px)',
                  },
                }}
              >
                <RecipeBookCard
                  product={{
                    itemID: product.itemID,
                    itemName: product.itemName,
                    author: product.author || 'MealMate',
                    itemType: product.itemType,
                    cost: product.cost,
                    recipesId: product.recipesId || [],
                    description: product.description,
                  }}
                  onShowDetails={handleShowDetails}
                  onAddToCart={handleAddToCart}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Details Modal */}
      {selectedProduct && (
        <RecipeDetailsModal
          open={detailsModalOpen}
          onClose={handleCloseDetailsModal}
          product={{
            itemID: selectedProduct.itemID,
            itemName: selectedProduct.itemName,
            author: selectedProduct.author || 'MealMate',
            itemType: selectedProduct.itemType,
            cost: selectedProduct.cost,
            recipesId: selectedProduct.recipesId || [],
            description: selectedProduct.description,
          }}
          onAddToCart={handleAddToCart}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
