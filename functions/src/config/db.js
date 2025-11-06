const mongoose = require('mongoose');

let isConnected = false;

async function connectDb() {
  if (isConnected) {
    console.log('✓ Already connected to MongoDB');
    return;
  }
  
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI not set');
  }
  
  try {
    await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    throw error;
  }
}

module.exports = { connectDb };
