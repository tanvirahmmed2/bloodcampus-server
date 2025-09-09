const express= require('express')
const { model } = require('mongoose')

const userRouter= express.Router()

userRouter.get('/', (req,res)=>{
    res.send('server is running')
})






module.exports= userRouter