const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const user=require('../../models/user');
const signup=async(req,res)=>{
    const{name,email,password,phoneNumber}=req.body;
    try {
        const exisitingUser=await user.findOne({email});
        if(exisitingUser)return res.json({message:'User already exists !!!'});
        const hashedPassword=await bcrypt.hash(password,12);
        const newUser=await user.create({name,email,phoneNumber,password:hashedPassword});
        const token=jwt.sign({email:newUser.email,id:newUser._id},process.env.SECRET,{ expiresIn: "1d" } );
        return res.status(201).json({success:true,result:newUser,token});    
    } catch (error) {
        console.log(error);
        return res.status(400).json({success:false,message:"something wrong ocurred"});
    }
    
}
const login=async(req,res)=>{
    const{email,password}=req.body;
    try {
        const exisitingUser=await user.findOne({email});
        if(!exisitingUser)return res.status(400).json({success:false,message:'User account does not exist !!!'});
        const isMatch=await bcrypt.compare(password,exisitingUser.password);
        if(!isMatch)return res.status(400).json({success:false,message:'passwords do not match !!'});
        const token=jwt.sign({email:exisitingUser.email,id:exisitingUser._id},process.env.SECRET,{ expiresIn: "1d" } );
        return res.status(201).json({success:true,result:exisitingUser,token});   
    } catch (error) {
        console.log(error);
        return res.status(400).json({success:false,message:"something wrong ocurred"});
    }
}
const updatePassword=async(req,res)=>{
    if(!req.user) return res.status(401).json({succss:false,message:'you are unauthorized to delete this account !!'});
    const {id} = req.params;
    try {
        const{password,newpassword}=req.body;
        const existingUser=await user.findOne({_id:id});
        const isMatch=await bcrypt.compare(password,existingUser.password);
        if(!isMatch)return res.status(401).json({success:false,message:"To change your password enter your previous password carefully !!"});
        const hashedPassword=await bcrypt.hash(newpassword,12);
        existingUser.password=hashedPassword;
        let updatedUser=await user.findByIdAndUpdate(id,existingUser,{new:true});
        return res.status(201).json({success:true,result:updatedUser,message:'Password changed !!'});
    } catch (error) {
        console.log(error);
        return res.status(400).json({succes:false,message:"something went wrong !!"});
    }
}
const deleteAccount=async(req,res)=>{
    if(!req.user) return res.status(401).json({success:false,message:'you are unauthorized to delete this account !!'});
    const {id}=req.params;
    try {
        if(id!==req.user.id)return res.json({success:false,message: "Unauthorized to delete this account !!"});
        await user.findByIdAndRemove(id);
        return res.json({success:true, message: "Account deleted successfully." });
    } catch (error) {
        console.log(error);
        return res.status(400).json({succes:false,message:"something went wrong !!"});
    }
}

module.exports={signup,login,updatePassword,deleteAccount}