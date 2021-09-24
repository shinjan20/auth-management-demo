const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const user=require('./routes/authroutes/user');
const admin=require('./routes/authroutes/admin');
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/user',user);
app.use('/admin',admin);
dotenv.config();
const PORT = process.env.PORT || 5000;
const DB_URI=process.env.DB_URI;
mongoose.connect(DB_URI,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    app.listen(PORT,()=>{console.log(`app is running on PORT ${PORT}`);})
}).catch(()=>{
    console.log('failed to connect to the database')
})