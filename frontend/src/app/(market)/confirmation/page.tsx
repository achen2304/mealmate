'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cartContext';

type OrderDetails = {
  items: Array<{
    itemID: string;
    itemName: string;
    itemType: string;
    cost: number;
  }>;
  subtotal: string;
  tax: string;
  total: string;
  date: string;
};

export default function ConfirmationPage() {
  const router = useRouter();
  const { cartItems, getSubtotal, getTaxAmount, getCartTotal } = useCart();
  const [transactionId, setTransactionId] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
  });
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const randomId =
      'TXN-' + Math.random().toString(36).substring(2, 11).toUpperCase();
    setTransactionId(randomId);

    if (typeof window !== 'undefined') {
      try {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
          setUserInfo(JSON.parse(storedUserInfo));
        }

        const storedOrder = sessionStorage.getItem('lastOrder');
        if (storedOrder) {
          setOrderDetails(JSON.parse(storedOrder));
        } else if (cartItems.length > 0) {
          const newOrder: OrderDetails = {
            items: [...cartItems],
            subtotal: getSubtotal().toFixed(2),
            tax: getTaxAmount().toFixed(2),
            total: getCartTotal().toFixed(2),
            date: new Date().toISOString(),
          };

          sessionStorage.setItem('lastOrder', JSON.stringify(newOrder));
          setOrderDetails(newOrder);
        }
      } catch (e) {
        console.error('Failed to parse data from storage:', e);
      }
    }
  }, [cartItems, getSubtotal, getTaxAmount, getCartTotal]);

  const displayItems = orderDetails?.items || cartItems;

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          maxWidth: 800,
          mx: 'auto',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 2,
              color: 'success.main',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 64 }} />
          </Box>

          <Typography variant="h4" component="h1" gutterBottom>
            Order Confirmed!
          </Typography>

          <Typography variant="body1" gutterBottom>
            Thank you for your purchase. Your order has been received and is
            being processed.
          </Typography>
          <Typography variant="h6">Transaction ID: {transactionId}</Typography>
        </Box>

        <Box sx={{ bgcolor: 'grey.100', p: 3, borderRadius: 2, mb: 4 }}>
          <Typography variant="h5" gutterBottom align="center" sx={{ mb: 2 }}>
            User Information
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 3 }}>
            <Box
              sx={{
                width: { xs: '100%', sm: '50%' },
                mb: { xs: 2, sm: 0 },
                px: { sm: 2 },
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {userInfo.name}
              </Typography>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {userInfo.email}
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="h5"
            gutterBottom
            align="center"
            sx={{ mb: 0, mt: 2 }}
          >
            Order Details
          </Typography>
          <Box sx={{ p: 3 }}>
            <List disablePadding>
              {displayItems.map((item) => (
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
              <Divider sx={{ my: 1 }} />
              <ListItem sx={{ p: 0 }}>
                <ListItemText primary="Subtotal" />
                <Typography variant="body2">
                  ${orderDetails?.subtotal || getSubtotal().toFixed(2)}
                </Typography>
              </ListItem>
              <ListItem sx={{ p: 0 }}>
                <ListItemText primary="Tax (7%)" />
                <Typography variant="body2">
                  ${orderDetails?.tax || getTaxAmount().toFixed(2)}
                </Typography>
              </ListItem>
              <ListItem sx={{ p: 0 }}>
                <ListItemText primary="Total" />
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  ${orderDetails?.total || getCartTotal().toFixed(2)}
                </Typography>
              </ListItem>
            </List>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/store')}
            sx={{ minWidth: 200 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
