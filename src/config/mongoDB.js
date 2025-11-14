const mongoose = require('mongoose');
const { MONGO_URL } = require('./secure');

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
