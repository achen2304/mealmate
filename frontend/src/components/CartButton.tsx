'use client';

import React, { useState } from 'react';
import {
  Badge,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useCart } from '@/context/cartContext';
import { useRouter } from 'next/navigation';

// Cart button for the app

export default function CartButton() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const {
    cartItems,
    removeFromCart,
    getSubtotal,
    getTaxAmount,
    getCartTotal,
    getCartItemCount,
    clearCart,
  } = useCart();

  // Handle the open for the cart button
  const handleOpen = () => {
    setOpen(true);
  };

  // Handle the close for the cart button
  const handleClose = () => {
    setOpen(false);
  };

  // Handle the remove item for the cart button
  const handleRemoveItem = (itemID: string) => {
    removeFromCart(itemID);
  };

  // Handle the checkout for the cart button
  const handleCheckout = () => {
    setOpen(false);
    router.push('/checkout');
  };

  // Format the currency for the cart button
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  // Render the cart button
  return (
    <>
      <IconButton
        color="inherit"
        aria-label="shopping cart"
        onClick={handleOpen}
        sx={{ position: 'relative' }}
      >
        <Badge badgeContent={getCartItemCount()} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Shopping Cart</Typography>
        </DialogTitle>
        <DialogContent dividers>
          {cartItems.length > 0 ? (
            <>
              <List>
                {cartItems.map((item) => (
                  <React.Fragment key={item.itemID}>
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveItem(item.itemID)}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={item.itemName}
                        secondary={`$${formatCurrency(item.cost)}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Subtotal: ${formatCurrency(getSubtotal())}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Tax (7%): ${formatCurrency(getTaxAmount())}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total: ${formatCurrency(getCartTotal())}
                </Typography>
              </Box>
            </>
          ) : (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Your cart is empty
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
          {cartItems.length > 0 && (
            <Button
              onClick={() => clearCart()}
              color="inherit"
              size="small"
              startIcon={<DeleteOutlineIcon />}
            >
              Clear Cart
            </Button>
          )}
          <Box>
            <Button onClick={handleClose} color="primary" sx={{ mr: 1 }}>
              Continue Shopping
            </Button>
            <Button
              onClick={handleCheckout}
              color="primary"
              variant="contained"
              disabled={cartItems.length === 0}
            >
              Checkout
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
