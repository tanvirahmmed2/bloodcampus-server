const app = require("./src/app");
const { PORT } = require("./src/config/secure");





app.listen(PORT, ()=>{
    console.log(`server is runningh at http://localhost:${PORT}`)
})