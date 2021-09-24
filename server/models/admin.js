const mongoose=require('mongoose');
const adminSchema=mongoose.Schema({
     name:String,
     email:{
         type:String,
         unique:true
     },
     password:String
},{timestamps:true})

const Admin=mongoose.model('admin',adminSchema);
module.exports=Admin;
