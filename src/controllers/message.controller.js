const Message = require("../models/message.model");


const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({})
        if (!messages || messages === null) {
            return res.status(400).send({
                success: false,
                message: 'no message found'
            });
        }
        return res.status(200).send({
            success: true,
            message: 'successfully found messages',
            payload: messages
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Failed to fetch messages',
            error: error.message
        });

    }
}


const newMessage=async (req,res) => {
    try {
        
    } catch (error) {
        
    }
    
}


const deleteMessage=async (req,res) => {
    try {
        
    } catch (error) {
        
    }
    
}

module.exports = {
    getMessages,
    newMessage,
    deleteMessage
}