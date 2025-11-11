const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const userRouter = require('./routers/user.router');
const messageRouter = require('./routers/message.router');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.get('/', (req, res) => {
    res.status(200).send({ success: true, message: 'API is healthy' });
});


app.use('/api/user', userRouter);
app.use('/api/message', messageRouter);


module.exports = app;
