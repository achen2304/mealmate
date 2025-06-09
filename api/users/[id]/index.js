// Serverless function for getting, updating, and deleting user by ID
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

  // Get user ID from URL
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // GET user by ID
    if (req.method === 'GET') {
      let userId;
      try {
        userId = new ObjectId(id);
      } catch (error) {
        return res.status(400).json({ error: 'Invalid user ID format' });
      }

      const user = await usersCollection.findOne({ _id: userId });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Don't send password back to client
      const { password, ...userWithoutPassword } = user;

      return res.status(200).json(userWithoutPassword);
    }

    // PUT - Update user by ID
    if (req.method === 'PUT') {
      let userId;
      try {
        userId = new ObjectId(id);
      } catch (error) {
        return res.status(400).json({ error: 'Invalid user ID format' });
      }

      const updates = req.body;

      // Don't allow updating _id
      if (updates._id) {
        delete updates._id;
      }

      // Hash password if it's being updated
      if (updates.password) {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);
      }

      const result = await usersCollection.updateOne(
        { _id: userId },
        { $set: updates }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const updatedUser = await usersCollection.findOne({ _id: userId });
      const { password, ...userWithoutPassword } = updatedUser;

      return res.status(200).json({
        message: 'User updated successfully',
        user: userWithoutPassword,
      });
    }

    // DELETE - Delete user by ID
    if (req.method === 'DELETE') {
      let userId;
      try {
        userId = new ObjectId(id);
      } catch (error) {
        return res.status(400).json({ error: 'Invalid user ID format' });
      }

      const result = await usersCollection.deleteOne({ _id: userId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({
        message: 'User deleted successfully',
      });
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('User operation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
