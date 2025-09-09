require('dotenv').config()
const app= require('./src/app')
const PORT= process.env.PORT || 5000


app.listen(PORT, (error)=>{
    if(!error){
        console.log(`Server is running at http://localhost:${PORT}`)
    }else{
        console.log(error)
    }
})


