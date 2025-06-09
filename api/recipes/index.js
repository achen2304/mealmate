// Serverless function for recipes API
const { MongoClient, ObjectId } = require('mongodb');

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

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const db = await connectToDatabase();
    const recipesCollection = db.collection('recipes');

    // GET all recipes
    if (req.method === 'GET') {
      const recipes = await recipesCollection.find({}).toArray();
      return res.status(200).json(recipes);
    }

    // POST - Create a new recipe
    if (req.method === 'POST') {
      const newRecipe = req.body;

      if (!newRecipe.name) {
        return res.status(400).json({ error: 'Recipe name is required' });
      }

      const result = await recipesCollection.insertOne({
        ...newRecipe,
        createdAt: new Date(),
      });

      const createdRecipe = await recipesCollection.findOne({
        _id: result.insertedId,
      });

      return res.status(201).json({
        message: 'Recipe created successfully',
        recipe: createdRecipe,
      });
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Recipes operation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
