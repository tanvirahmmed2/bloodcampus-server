const express= require('express')
const { getUser,  Register, Login, Logout } = require('../controllers/user.controller')
const isLogin = require('../middleware/user.middleware')

const userRouter= express.Router()

userRouter.get('/', getUser)


userRouter.post('/register',isLogin, Register)
userRouter.post('/login', Login)
userRouter.post('/logout',isLogin, Logout)






module.exports= userRouter