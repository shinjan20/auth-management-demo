const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const Admin=require('../../models/admin');
const signup=async(req,res)=>{
    const{name,email,password}=req.body;
    try {
        const exisitingAdmin=await Admin.findOne({email});
        if(exisitingAdmin)return res.status(400).json({success:false,message:'Admin account already exists !!!'});
        const hashedPassword=await bcrypt.hash(password,12);
        const newAdmin=await Admin.create({name,email,password:hashedPassword});
        const token=jwt.sign({email:newAdmin.email,id:newAdmin._id},process.env.SECRET,{ expiresIn: "1d" } );
        return res.status(201).json({success:true,result:newAdmin,token});   
    } catch (error) {
        console.log(error);
        return res.status(400).json({success:false,message:"something wrong ocurred"});
    }
}
const login=async(req,res)=>{
    const{email,password}=req.body;
    try {
        const exisitingAdmin=await Admin.findOne({email});
        if(!exisitingAdmin)return res.status(400).json({success:false,message:'Admin account does not exist !!!'});
        const isMatch=await bcrypt.compare(password,exisitingAdmin.password);
        if(!isMatch)return res.status(400).json({success:false,message:'passwords do not match !!'});
        const token=jwt.sign({email:exisitingAdmin.email,id:exisitingAdmin._id},process.env.SECRET,{ expiresIn: "1d" } );
        return res.status(201).json({success:true,result:exisitingAdmin,token});
    } catch (error) {
        console.log(error);
        return res.status(400).json({success:false,message:"something wrong ocurred"});
    }
}
const updatePassword=async(req,res)=>{
    if(!req.user) return res.status(401).json({success:false,message:'you are unauthorized to delete this account !!'});
    const {id} = req.params;
    try {
        const{password,newpassword}=req.body;
        const existingAdmin=await Admin.findOne({_id:id});
        if(!existingAdmin)return res.status(404).json({success:false,message:"Admin account doesn't exist"});
        const isMatch=await bcrypt.compare(password,existingAdmin.password);
        if(!isMatch)return res.status(401).json({success:false,message:"To change your password enter your previous password carefully !!"});
        const hashedPassword=await bcrypt.hash(newpassword,12);
        existingAdmin.password=hashedPassword;
        let updatedAdmin=await Admin.findByIdAndUpdate(id,existingAdmin,{new:true});
        return res.status(201).json({success:true,result:updatedAdmin,message:'Password changed !!'});
    } catch (error) {
        console.log(error);
        return res.status(400).json({succes:false,message:"something went wrong !!"});
    }
}
const deleteAccount=async(req,res)=>{
    if(!req.user) return res.status(401).json({success:false,message:'you are unauthorized to delete this account !!'});
    const {id} = req.params;
    try {
        if(id!==req.user.id)return res.status(401).json({success:false,message: "Unauthorized to delete this account !!"});
        await Admin.findByIdAndRemove(id);
        return res.json({success:true, message: "Account deleted successfully." });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success:false,message:"something went wrong !!"});
    }
}

module.exports={signup,login,updatePassword,deleteAccount}