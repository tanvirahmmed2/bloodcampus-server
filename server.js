require('dotenv').config();
const app = require('./src/app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;

const connectMongo = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log(" MongoDB Database Connected");

        app.listen(PORT, () => {
            console.log(` Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(" MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

connectMongo();
