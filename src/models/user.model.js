const mongoose= require('mongoose')



const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    bloodgroup:{
        type: String,
        required: true,

    },
    district:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true,
    },
    lastdoneted:{
        type: Date,
        
    },
    createdOn:{
        type: Date,
        default: Date.now()
    }
    
})


const User= mongoose.model('users',userSchema)

module.exports= User
