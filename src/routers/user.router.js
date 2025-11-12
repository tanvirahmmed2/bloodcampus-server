const express= require('express')
const { getUser,  Register, Login, Logout, protectedUser, changeAvailabilty } = require('../controllers/user.controller')
const {isLogin} = require('../middleware/user.middleware')

const userRouter= express.Router()

userRouter.get('/', getUser)


userRouter.post('/register',  Register)
userRouter.post('/login', Login)
userRouter.post('/logout',isLogin, Logout)
userRouter.get('/protected',isLogin, protectedUser)



userRouter.post('/changeavailability', isLogin, changeAvailabilty)






module.exports= userRouter