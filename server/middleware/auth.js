const jwt=require('jsonwebtoken');
const auth=async(req,res,next)=>{
      try {
          if(req.headers.authorization)
         {
           const token=req.headers.authorization.split(" ")[1];
           let decodeddata;
             decodeddata=jwt.verify(token,process.env.SECRET);
             if(decodeddata)
             {
               req.user=decodeddata;
             }
             else req.user=null;
         }
         next(); 
      } catch (error) {
         console.log(error);
      }
}

module.exports=auth;