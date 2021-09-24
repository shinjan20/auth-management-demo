const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
     name:String,
     email:{
         type:String,
         unique:true
     },
     phoneNumber:Number,
     password:String
},{timestamps:true})

const user=mongoose.model('user',userSchema);
module.exports=user;