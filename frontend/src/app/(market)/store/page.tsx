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
  Add,
} from '@mui/icons-material';
import { useCart } from '@/context/cartContext';
import RecipeBookCard from './RecipeBookCard';
import RecipeDetailsModal from './RecipeDetailsModal';
import SearchBar from '@/components/SearchBar';
import { storeApi, StoreItem } from '@/lib/storeapi';
import CreateRecipeBookModal from './CreateRecipeBookModal';

export default function StorePage() {
  const theme = useTheme();
  const [products, setProducts] = useState<StoreItem[]>([]);
  const { addToCart, isItemInCart, removeFromCart } = useCart();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'info' | 'warning' | 'error'
  >('success');
  const [selectedProduct, setSelectedProduct] = useState<StoreItem | null>(
    null
  );
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipeBooks, setFilteredRecipeBooks] = useState<StoreItem[]>(
    []
  );
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const items = await storeApi.getAllItems();
        setProducts(items);
      } catch (error) {
        console.error('Error fetching store items:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const recipeBooks = products.filter(
      (product) => product.type === 'Recipe Book'
    );

    if (searchTerm.trim() === '') {
      setFilteredRecipeBooks(recipeBooks);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase().trim();
      const searchWords = lowercasedSearch.split(/\s+/);

      const filtered = recipeBooks.filter((book) => {
        const bookTitle = book.name.toLowerCase();
        const authorName = book.author.toLowerCase();

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
    (product) => product.type === 'Subscription'
  );

  const handleAddToCart = (product: StoreItem) => {
    if (isItemInCart(product._id)) {
      removeFromCart(product._id);

      setSnackbarOpen(false);
      setTimeout(() => {
        setSnackbarMessage(`${product.name} removed from cart`);
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
      }, 100);
      return;
    }

    addToCart({
      itemID: product._id,
      itemName: product.name,
      itemType: product.type,
      cost: product.cost,
      recipesId: product.recipesId,
    });

    setSnackbarOpen(false);
    setTimeout(() => {
      setSnackbarMessage(`${product.name} added to cart`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }, 100);
  };

  const handleShowDetails = (product: StoreItem) => {
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

  const handleCreateSuccess = () => {
    const fetchProducts = async () => {
      try {
        const items = await storeApi.getAllItems();
        setProducts(items);
      } catch (error) {
        console.error('Error fetching store items:', error);
      }
    };
    fetchProducts();
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
              key={product._id}
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
                      {product.name}
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
                    {product.description.map((feature, index) => (
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
                      isItemInCart(product._id) ? (
                        <CheckCircle />
                      ) : (
                        <ShoppingCart />
                      )
                    }
                    onClick={() => handleAddToCart(product)}
                    color={isItemInCart(product._id) ? 'success' : 'primary'}
                  >
                    {isItemInCart(product._id) ? 'Remove' : 'Add to Cart'}
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
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateModalOpen(true)}
            sx={{ ml: 'auto', borderRadius: 2 }}
          >
            Create Recipe Book
          </Button>
        </Box>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Explore our curated collection of recipe books
        </Typography>

        <Box sx={{ mb: 3 }}>
          <SearchBar onSearch={handleSearch} />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {filteredRecipeBooks.map((book) => (
            <RecipeBookCard
              key={book._id}
              book={book}
              onAddToCart={handleAddToCart}
              onShowDetails={handleShowDetails}
              isInCart={isItemInCart(book._id)}
            />
          ))}
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {selectedProduct && (
        <RecipeDetailsModal
          open={detailsModalOpen}
          onClose={handleCloseDetailsModal}
          product={selectedProduct}
          onAddToCart={handleAddToCart}
          isInCart={isItemInCart(selectedProduct._id)}
        />
      )}

      <CreateRecipeBookModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </Container>
  );
}
