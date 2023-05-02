const jwt=require("jsonwebtoken");
require('dotenv').config()

const authentication=(req,res,next)=>{
    let token=req.headers.authorization
    let decoded=jwt.verify(token,process.env.secret)
    if(decoded){
        req.body.userId=decoded.userId;
        next()
    }else{
        return res.status(404).send({"msg":"you have not loggedin"})
    }
}

module.exports={
    authentication
}