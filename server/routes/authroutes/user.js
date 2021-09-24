const {signup,login,updatePassword,deleteAccount} = require('../../controllers/authcontroller/user');
const auth = require('../../middleware/auth');
const router=require('express').Router();
router.post('/signup',signup);
router.post('/login',login);
router.patch('/updatePassword/:id',auth,updatePassword);
router.patch('/delete/:id',auth,deleteAccount);
module.exports=router;