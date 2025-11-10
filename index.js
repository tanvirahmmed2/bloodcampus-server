const app = require("./src/app");
const connectDB = require("./src/config/mongoDB");
const { PORT } = require("./src/config/secure");





app.listen(PORT, ()=>{
    connectDB()
    console.log(`server is runningh at http://localhost:${PORT}`)
})