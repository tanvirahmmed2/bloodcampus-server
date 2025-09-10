const express= require('express')
const createErr= require('http-errors')
const { SignUp, getUser } = require('../controllers/user.controller')
const User = require('../models/user.model')

const userRouter= express.Router()

userRouter.get('/', getUser)


userRouter.post('/signup', SignUp)






module.exports= userRouter