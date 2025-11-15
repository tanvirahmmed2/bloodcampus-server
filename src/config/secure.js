require('dotenv').config()



const PORT= process.env.PORT
const MONGO_URL= process.env.MONGO_URL
const JWT_SECRET= process.env.JWT_SECRET
const BREVO_API_KEY=process.env.BREVO_API_KEY
const SENDER_EMAIL=process.env.SENDER_EMAIL




module.exports={
    PORT, MONGO_URL, JWT_SECRET, SENDER_EMAIL, BREVO_API_KEY
}