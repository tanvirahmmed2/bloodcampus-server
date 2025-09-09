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
        default: new Date('2020-01-01')
        
    },
    createdOn:{
        type: Date,
        default: Date.now()
    }
    
})


const User= mongoose.model('users',userSchema)

module.exports= User
