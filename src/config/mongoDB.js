const mongoose= require('mongoose')
const { MONGO_URL } = require('./secure')

const connectDB= async () => {
    try {
        await mongoose.connect(MONGO_URL)
        console.log('DataBase connected successfully')
    } catch (error) {
        console.log(error)
        
    }
    
}

module.exports= connectDB