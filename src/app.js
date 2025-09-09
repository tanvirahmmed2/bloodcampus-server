const express= require('express')
const userRouter = require('./routers/user.router')



const app= express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/api/user', userRouter)


module.exports= app