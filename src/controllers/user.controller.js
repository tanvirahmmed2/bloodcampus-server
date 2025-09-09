



const SignUp= (req,res)=>{
    try {
        const {username, email}= req.body
        if(!username){
            res.send({
                success: false,
                message: 'username not found'
            })
        }
        res.status(200).send({
            message: 'user created',
            payload: {username, email}
        })
        
    } catch (error) {
        res.status(500).send({ error: error.message })
        
    }
}


module.exports={
    SignUp
}