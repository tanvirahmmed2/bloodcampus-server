const mongoose= require('mongoose')



const userSchema= new mongoose({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    
})


const User= mongoose.model('users',userSchema)

module.exports= User