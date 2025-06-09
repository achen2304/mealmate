// Serverless function for individual recipe operations
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
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

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

  // Get recipe ID from URL
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ error: 'Recipe ID is required' });
  }

  try {
    const db = await connectToDatabase();
    const recipesCollection = db.collection('recipes');

    let recipeId;
    try {
      recipeId = new ObjectId(id);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid recipe ID format' });
    }

    // GET recipe by ID
    if (req.method === 'GET') {
      const recipe = await recipesCollection.findOne({ _id: recipeId });

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      return res.status(200).json(recipe);
    }

    // PUT - Update recipe by ID
    if (req.method === 'PUT') {
      const updates = req.body;

      // Don't allow updating _id
      if (updates._id) {
        delete updates._id;
      }

      const result = await recipesCollection.updateOne(
        { _id: recipeId },
        { $set: updates }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      const updatedRecipe = await recipesCollection.findOne({ _id: recipeId });

      return res.status(200).json({
        message: 'Recipe updated successfully',
        recipe: updatedRecipe,
      });
    }

    // DELETE - Delete recipe by ID
    if (req.method === 'DELETE') {
      const result = await recipesCollection.deleteOne({ _id: recipeId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      return res.status(200).json({
        message: 'Recipe deleted successfully',
      });
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Recipe operation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
