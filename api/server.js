require('dotenv').config();
const mongoose = require('mongoose');
const serverless = require('serverless-http');
const app = require('../src/app');

const MONGO_URL = process.env.MONGO_URL;

// connect to MongoDB only once
let isConnected = false;

async function connectMongo() {
  if (isConnected) return;
  await mongoose.connect(MONGO_URL);
  isConnected = true;
  console.log("MongoDB connected");
}

const handler = async (req, res) => {
  await connectMongo();
  return serverless(app)(req, res);
};

module.exports = handler;
