const express= require('express')
const createErr= require('http-errors')
const { SignUp } = require('../controllers/user.controller')

const userRouter= express.Router()

userRouter.get('/', (req,res)=>{
    res.send('server is running')
})


userRouter.post('/signup', SignUp)






module.exports= userRouter