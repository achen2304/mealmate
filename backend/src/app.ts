import express from 'express';
import cors from 'cors';
import apiRouter from './api';

const app = express();

// CORS configuration
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// API Routes
app.use(apiRouter);

export default app;
