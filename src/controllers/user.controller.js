



const SignUp= (req,res)=>{
   try {
    const {username, email}=req.body
   } catch (error) {
        console.log('error:', error)
   }
}


module.exports={
    SignUp
}