const express= require('express')
const { getMessages, newMessage, deleteMessage } = require('../controllers/message.controller')
const { isLogin, isAdmin } = require('../middleware/user.middleware')

const messageRouter= express.Router()


messageRouter.get('/', getMessages)
messageRouter.post('/new', newMessage)
messageRouter.delete('/remove', isLogin, isAdmin, deleteMessage)



module.exports= messageRouter