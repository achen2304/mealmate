'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useCart } from '@/context/cartContext';
import { useRouter } from 'next/navigation';

type FormErrors = {
  cardName: string;
  cardNumber: string;
  expDate: string;
  cvv: string;
  email: string;
};

type FormData = {
  cardName: string;
  cardNumber: string;
  expDate: string;
  cvv: string;
  email: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();

  const [formData, setFormData] = useState<FormData>({
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: '',
    email: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: '',
    email: '',
  });

  const TAX_RATE = 0.07;

  const calculateSubtotal = () => {
    return cartItems
      .reduce((total, item) => total + parseFloat(item.cost.toString()), 0)
      .toFixed(2);
  };

  const calculateTax = () => {
    const subtotal = parseFloat(calculateSubtotal());
    return (subtotal * TAX_RATE).toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const tax = parseFloat(calculateTax());
    return (subtotal + tax).toFixed(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    const fieldName = name as keyof FormErrors;
    if (errors[fieldName]) {
      setErrors({
        ...errors,
        [fieldName]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {
      cardName: '',
      cardNumber: '',
      expDate: '',
      cvv: '',
      email: '',
    };
    let isValid = true;

    if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      isValid = false;
    }

    if (!formData.expDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      newErrors.expDate = 'Please enter a valid expiry date (MM/YY)';
      isValid = false;
    }

    if (!formData.cvv.match(/^\d{3}$/)) {
      newErrors.cvv = 'Please enter a valid 3-digit CVV';
      isValid = false;
    }

    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Please enter cardholder name';
      isValid = false;
    }

    if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const orderDetails = {
        items: [...cartItems],
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        total: calculateTotal(),
        date: new Date().toISOString(),
      };

      if (formData.email && formData.cardName) {
        const userInfo = {
          name: formData.cardName,
          email: formData.email,
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
      }

      sessionStorage.setItem('lastOrder', JSON.stringify(orderDetails));

      setTimeout(() => {
        clearCart();
        router.push('/confirmation');
      }, 1000);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/store')}
            sx={{ mt: 2 }}
          >
            Return to Store
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        Checkout
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
        }}
      >
        {/* Order Summary Sidebar */}
        <Box sx={{ width: { xs: '100%', md: '350px' }, flexShrink: 0 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <List disablePadding>
              {cartItems.map((item) => (
                <ListItem key={item.itemID} sx={{ py: 1, px: 0 }}>
                  <ListItemText
                    primary={item.itemName}
                    secondary={item.itemType}
                  />
                  <Typography variant="body2">
                    ${item.cost.toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
              <Divider sx={{ my: 2 }} />
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Subtotal" />
                <Typography variant="body1">${calculateSubtotal()}</Typography>
              </ListItem>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Tax (7%)" />
                <Typography variant="body1">${calculateTax()}</Typography>
              </ListItem>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Total" />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  ${calculateTotal()}
                </Typography>
              </ListItem>
            </List>
          </Paper>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: '1 1 auto', width: '100%' }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box component="form" onSubmit={handlePlaceOrder}>
              <Typography variant="h6" gutterBottom>
                Payment Details
              </Typography>

              <Box sx={{ mb: 2 }}>
                <TextField
                  required
                  id="email"
                  name="email"
                  label="Email Address"
                  fullWidth
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  margin="normal"
                />
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ width: '100%' }}>
                  <TextField
                    required
                    id="cardName"
                    name="cardName"
                    label="Name on Card"
                    fullWidth
                    value={formData.cardName}
                    onChange={handleInputChange}
                    error={!!errors.cardName}
                    helperText={errors.cardName}
                    margin="normal"
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <TextField
                    required
                    id="cardNumber"
                    name="cardNumber"
                    label="Card Number"
                    fullWidth
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    error={!!errors.cardNumber}
                    helperText={errors.cardNumber}
                    placeholder="1234 5678 9012 3456"
                    margin="normal"
                  />
                </Box>
                <Box
                  sx={{
                    flex: '1 1 calc(50% - 8px)',
                    minWidth: { xs: '100%', sm: 'calc(50% - 8px)' },
                  }}
                >
                  <TextField
                    required
                    id="expDate"
                    name="expDate"
                    label="Expiry Date"
                    fullWidth
                    value={formData.expDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    error={!!errors.expDate}
                    helperText={errors.expDate}
                    margin="normal"
                  />
                </Box>
                <Box
                  sx={{
                    flex: '1 1 calc(50% - 8px)',
                    minWidth: { xs: '100%', sm: 'calc(50% - 8px)' },
                  }}
                >
                  <TextField
                    required
                    id="cvv"
                    name="cvv"
                    label="CVV"
                    fullWidth
                    value={formData.cvv}
                    onChange={handleInputChange}
                    error={!!errors.cvv}
                    helperText={errors.cvv}
                    margin="normal"
                  />
                </Box>
              </Box>

              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => router.push('/store')}
                >
                  Back to Store
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  Place Order
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
