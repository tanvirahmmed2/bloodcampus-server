const express= require('express')
const { getUser,  Register, Login, Logout, protectedUser, changeAvailabilty, changePassword, requestDonor, deleteRequest, updateProfile, getFilteredData, banuser, newaccess, removeaccess, deleteUser } = require('../controllers/user.controller')
const {isLogin, isAdmin} = require('../middleware/user.middleware')

const userRouter= express.Router()

userRouter.get('/', getUser)


userRouter.post('/register',  Register)
userRouter.post('/login', Login)
userRouter.post('/logout',isLogin, Logout)
userRouter.get('/protected',isLogin, protectedUser)

userRouter.get('/filter', getFilteredData)


userRouter.post('/updateprofile', isLogin, updateProfile)
userRouter.post('/changeavailability', isLogin, changeAvailabilty)
userRouter.post('/changepassword', isLogin, changePassword)
userRouter.post('/request', isLogin, requestDonor)
userRouter.post('/deleterequest',isLogin,  deleteRequest)


userRouter.post('/newaccess',isLogin, isAdmin, newaccess)
userRouter.post('/removeaccess', isLogin, isAdmin, removeaccess)
userRouter.post('/banuser',isLogin, isAdmin, banuser)
userRouter.post('/deleteuser', isLogin, isAdmin, deleteUser)







module.exports= userRouter