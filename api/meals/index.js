// Sample serverless function for meals API
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

// MongoDB connection
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const MONGODB_URI =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/mealmate';

  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db();
  cachedDb = db;
  return db;
}

// Sample meal data
const sampleMeals = [
  {
    id: 1,
    name: 'Grilled Chicken Salad',
    calories: 350,
    protein: 30,
    carbs: 10,
    fat: 15,
  },
  {
    id: 2,
    name: 'Veggie Stir Fry',
    calories: 300,
    protein: 15,
    carbs: 40,
    fat: 10,
  },
  {
    id: 3,
    name: 'Salmon with Roasted Vegetables',
    calories: 450,
    protein: 35,
    carbs: 25,
    fat: 20,
  },
];

module.exports = async (req, res) => {
  // Get the origin from the request
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'mealmate.czchen.dev',
    'https://mealmate-three.vercel.app',
  ];

  // Set CORS headers
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // For requests without origin header or in production, allow any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // For demonstration, we'll just return sample data
  // In a real implementation, you would connect to your database
  // const db = await connectToDatabase();
  // const collection = db.collection('meals');
  // const meals = await collection.find({}).toArray();

  res.status(200).json({
    success: true,
    data: sampleMeals,
  });
};
