require('dotenv').config();
const mongoose = require('mongoose');
const serverless = require('serverless-http');

// Import your Express application logic from app.js
const app = require('../src/app');

// A self-contained function to connect to MongoDB
async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    // Connection is already established
    console.log("✅ MongoDB already connected");
    return;
  }
  try {
    const MONGO_URL = process.env.MONGO_URL;
    if (!MONGO_URL) {
      throw new Error("MONGO_URL environment variable is not set.");
    }
    await mongoose.connect(MONGO_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

// This is the Vercel serverless function entry point
// Vercel automatically handles the request and response objects
// We use serverless-http to wrap the Express app and handle routing
module.exports = async (req, res) => {
  // Call the database connection function on every request
  await connectToDatabase();

  // Return the handler wrapped by serverless-http
  return serverless(app)(req, res);
};
