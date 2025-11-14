const Message = require("../models/message.model");


const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({})
        if (!messages || messages.length===0) {
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


const newMessage = async (req, res) => {
    try {
        const { name, message, email, subject } = req.body
        if (!name || !message || !email || !subject) {
            return res.status(400).send({
                success: false,
                message: 'All fields are required'
            });
        }
        const existMessage = await Message.findOne({ email: email })
        if (existMessage) {
            return res.status(400).send({
                success: false,
                message: 'One message already in review'
            });
        }
        const newMessage = new Message({ name, message, email, subject })
        await newMessage.save()
        return res.status(200).send({
            success: true,
            message: 'Successfully sent message'
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }

}


const deleteMessage = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) {
            return res.status(400).send({
                success: false,
                message: 'Message id not found'
            });
        }
        const message = await Message.findById(id)
        if (!message) {
            return res.status(400).send({
                success: false,
                message: 'No message found with this id'
            });
        }
        await Message.findByIdAndDelete(id)
        return res.status(200).send({
            success: true,
            message: 'successfully deleted message'
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }

}

module.exports = {
    getMessages,
    newMessage,
    deleteMessage
}