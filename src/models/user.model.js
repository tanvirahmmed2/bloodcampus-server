const mongoose = require('mongoose')



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    bloodgroup: {
        type: String,
        required: true,

    },
    district: {
        type: String,
        required: true
    },
    upazilla: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    dateofbirth: {
        type: Date,
        required: true,
    },
    nid: {

        type: String,
        unique: true
    },
    lastdoneted: {
        type: Date,
        default: new Date('2020-01-01')

    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    isBanned: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        trim: true,
        enum: ['admin, member']
    },
    totalDonated: {
        type: Number,
        default: 0
    },
    messages: [
        {
            name: { type: String, trim: true, required: true },
            number: { type: String, trim: true, required: true },
            district: { type: String, trim: true, required: true },
            message: { type: String, trim: true, required: true },
        }
    ],
    resetToken: {
        type: String,
        trim: true
    },
    tokenExpireAt: {
        type: Date,
        trim: true,
    },
    createdOn: {
        type: Date,
        default: Date.now()
    }

})


const User = mongoose.model('users', userSchema)

module.exports = User
