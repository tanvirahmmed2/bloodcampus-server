require('dotenv').config();
const mongoose = require('mongoose');
const serverless = require('serverless-http');
const app = require('../src/app');

const MONGO_URL = process.env.MONGO_URL;

let isConnected = false;

async function connectMongo() {
  if (isConnected) return;
  await mongoose.connect(MONGO_URL);
  isConnected = true;
  console.log("✅ MongoDB connected");
}

// Export handler for Vercel
module.exports = async (req, res) => {
  await connectMongo();
  return serverless(app)(req, res);
};
