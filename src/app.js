const express = require('express');
const cors = require('cors');
const userRouter = require('./routers/user.router');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(cors({
    origin: ['https://bloodcampus.netlify.app', ' http://localhost:3000'],
    credentials: true,
}));

app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is healthy' });
});


app.use('/api/user', userRouter);

module.exports = app;
