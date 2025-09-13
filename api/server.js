// api/server.js

require('dotenv').config();
const mongoose = require('mongoose');

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
    // You might want to re-throw the error or handle it gracefully
    throw error;
  }
}

// This is the Vercel serverless function entry point
// Vercel automatically handles the request and response objects
module.exports = async (req, res) => {
  // Call the database connection function on every request
  // Vercel's serverless function instances will reuse the connection
  // for subsequent requests, so the `connectToDatabase` function will
  // only run once for a given instance lifecycle.
  await connectToDatabase();

  // Your existing app's request handler logic
  app(req, res);
};