import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import validator from 'validator'
import { createTOken, sendAdminEmail } from '../utils/util.js';


const createUser=async(req,res)=>{
    const{userData,userId}=req.body;
    const{name,email,password,city,post,mobile,birthDay,whatsapp,linkedIn,github}=userData;
    try {
        const admin=await User.findById(userId);
        if(admin.role!=='admin')
            res.json({success:false,message:'Cannot create user, you are not admin'});

        const isExists= await User.findOne({email});
        if(isExists)
           return res.json({success:false,message:'Email already registered'});
        if(!validator.isEmail(email))
         return res.json({success:false,message:'Enter valid email'});

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        
        const newUser=new User({name,email,post,city,mobile,birthDay,whatsapp,password:hashedPassword,socials:{github,linkedIn}});
        newUser.admin=userId;
        await newUser.save();

        const subject='New User Created';
        const message=`New user ${newUser.name} is created from your account. If not done by you kindely review your security options. `
        await sendAdminEmail(admin.email,newUser.email,subject,message);
        
        res.json({success:true,message:'User created successfully'})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:'Error Occured'})
    }
    
}


const signIn=async(req,res)=>{
   const{user}=req.body;
   
   try{
       const isExists= await User.findOne({email:user.email});
       if(isExists)
          return res.json({success:false,message:'Email already registered'});
       if(!validator.isEmail(user.email))
        return res.json({success:false,message:'Enter valid email'});
      
       const salt=await bcrypt.genSalt(10);
       const hashedPassword=await bcrypt.hash(user.password,salt);
    
       const newUser=new User({...user,password:hashedPassword,role:'admin'});
       newUser.notifications.push({message:"yayy, Welcome to Staffify👋🏼"});
       await newUser.save();
       console.log(newUser);
       
       const token=createTOken(newUser._id);
       res.json({success:true,user:newUser,token});
   }catch(error){
    console.log(error);
    
     res.json({success:false,message:"Error occured while sign in"});
   } 
}
const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user= await User.findOne({email}).populate({
            path: 'tasks',
            populate: {
              path: 'comments.createdBy',
            },
          })
          .populate({
            path: 'notifications.taskId',
            populate:{
                path:'comments.createdBy'
            },
          })
          .lean();
          if(!user)
          return  res.json({success:false, message:"User doesn't exist"});
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch)
            return res.json({success:false,message:"Incorrect password"});
        const token=createTOken(user._id);

        //add a notification
        user.notifications.push({message:"You logged in",createdAt:Date.now()});
          await user.save()
            user.password='';
            
        res.json({success:true,token,user,message:`Welcome back ${user.name}`});
    }catch(error){
        console.log(error);
        
        res.json({success:false,message:"Error occured during login"});
    }
}

const switchRole=async(req,res)=>{
    try{
        const admin=await User.findById(req.body.userId);
        if(admin.role!=='admin')
          return  res.json({success:false,message:'you have no authority to make other admin'});
        const user= await User.findOne({email:req.body.userEmail});
        if(!user)
            return res.json({success:false,message:'user not found'});
        if(user.role==='admin')
            return res.json({success:false,message:'User is already an admin'});

        user.role = 'admin';
        user.notifications.push({message:"You are promoted as admin"});
        await user.save();
        
        const title=`Admin changed`
        const message= `New admin ${user.email} is created from your account.`
        await sendAdminEmail(admin.email,user.email,title,message);
        res.json({success:true,message:'Admin updated'})
    }
    catch(error){
        return res.json({success:false,message:'Error occured'})
    }
}

const fetchUsers=async(req,res)=>{
    try {
        const users=await User.find({}).populate('tasks');
        res.json({success:true,users})
    } catch (error) {
        res.json({success:false,message:"error occured while fetxhing data"});
    }
}
const fetchUser=async(req,res)=>{
    try {
        const user=await User.findById(req.headers.id).populate('tasks');

        res.json({success:true,user:user})
    } catch (error) {
        res.json({success:false,message:"error occured while fetxhing data"});
    }
}
const deleteNoti=async(req,res)=>{
  let{notiId,userId}=req.body;
   
  try {
    const user=await User.findByIdAndUpdate(userId,{$pull:{notifications:{_id:notiId}}},{new:true})
      .populate({
        path: 'notifications.taskId',
        populate:{
            path:'comments.createdBy'
        },
      })
      .lean();
     
    res.json({success:true,message:'Deleted',user})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error occured while removing notification"})
    
  }



  
}
export {signIn,login,fetchUsers,switchRole,fetchUser,createUser,deleteNoti}