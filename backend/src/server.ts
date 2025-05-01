import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 8080;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/mealmate';

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

export default app;
