const express = require('express');
const cors = require('cors');
const userRouter = require('./routers/user.router');

const app = express();

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS
app.use(cors({
    origin: 'https://bloodcampus.netlify.app', 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

// Routes
app.use('/api/user', userRouter);

module.exports = app;
