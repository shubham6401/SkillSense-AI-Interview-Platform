const jwt=require("jsonwebtoken");
const protect=(req,res,next)=>{
    try{
        let token=req.headers.authorization;
        // console.log(token);
        
        if(!token){
            return res.status(401).json({
                    message: "No token provided"
                });
        }
        token=token.split(" ")[1];
        // console.log("token",token);
        let decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }
    catch(e){
        console.log(e);
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}
module.exports=protect;
