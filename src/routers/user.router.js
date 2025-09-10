const express= require('express')
const { getUser,  Register, Login } = require('../controllers/user.controller')
const User = require('../models/user.model')

const userRouter= express.Router()

userRouter.get('/', getUser)


userRouter.post('/register', Register)
userRouter.post('/login', Login)






module.exports= userRouter