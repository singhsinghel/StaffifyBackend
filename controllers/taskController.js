import Task from "../models/taskModel.js";
import User from "../models/userModel.js";

const createTask=async(req,res)=>{
    try{
        const {assignTo,userId}=req.body;
        const user=await User.findOne({email:assignTo.email});
        if(!user)
          return res.json({success:false,message:"User doesn't exist"});
        const task=new Task(req.body.task);
        task.user=user._id;
        task.createdBy=userId;

        await task.save();
          
        user.tasks.push(task._id);
        user.notifications.push({message:'New task has been assigned',taskId:task._id}).populate('tasks').populate('notificaions.taskId');
        await user.save();
        res.json({success:true,message:'task successfully sent',user});
       
    }catch(error){
        console.log(error);
        
        res.json({success:false,message:'error occured while assigning task'});
    }

}
const deleteTask=async(req,res)=>{
    try{
        const {userId,taskId}= req.body;

        const user=await User.findById(userId);
        if(user.role!=='admin')
           return res.json({success:false,message:'You are not authorized to delete the task'});

        const task=Task.findById(taskId);
        if(!task)
            return res.json({success:false,message:"No such task exists"});
         
        await Task.findByIdAndDelete(taskId);
       
        await User.updateMany({tasks:taskId},{$pull:{tasks:taskId}, $push:{ notifications:{ message:'Task deleted',taskId:task._id }}});

        res.json({success:true,message:"Task deleted successfully"});
    }catch(error){
        res.json({success:false,message:"Error occurred while deleting the tasks"});
    }
}
const fetchTask=async(req,res)=>{
    try{
        const tasks=await Task.find({}).populate('user');
        if(!tasks)
            return res.json({success:false,message:"No tasks to show"});
        res.json({success:true, tasks:tasks})
    }catch(error){
       res.json({success:false,message:'Something went wrong'})
    }

};
const fetchUserTasks=async(req,res)=>{
    const {userId}=req.body;
    const user=await User.findById(userId).populate('tasks');
    if(!user)
        return res.json({success:false,message:"No user found"});
    res.json({success:true,tasks:user.tasks})

};

const updateTask=async(req,res)=>{
    const {taskId,status}=req.body;
    try {
        const task=await Task.findById(taskId).populate('user');
        if(status==='accepted'){
            task.accepted=true,
            task.newTask=false,
            task.status='Active'
        }
        else
          task.status=status
        
        await task.save();

        await User.findByIdAndUpdate(task.createdBy,{$push:{notifications:{message:`name:${task.user.name} task:${task.title} statue: ${task.status}  `,taskId:task._id}}},{new:true});
        
        res.json({success:true,message:`Marked as ${status}`});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:'Error occured'})
    }

}

const changeUser = async (req, res) => {
    try {
      const { taskId, targetUserId } = req.body;
  
      // Find the task by ID
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
  
      // Update target user by adding the task ID to their tasks array
      const targetUser = await User.findByIdAndUpdate(targetUserId, { $push: { tasks: taskId },$pull:{notifications:{message:"A task has been assigned to you",taskId:task._id}}},{ new: true });
      if (!targetUser) {
        return res.status(404).json({ success: false, message: 'Target user not found' });
      }
  
      // Update the existing user by removing the task ID from their tasks array
      const existingUser = await User.findByIdAndUpdate(task.user, { $pull: { tasks: taskId } }, { new: true });
      if (!existingUser) {
        return res.status(404).json({ success: false, message: 'Existing user not found' });
      }
  
      // Update task's assigned user and save the task
      task.user = targetUserId;
      task.accepted=false;
      task.status='';
      task.newTask=true;
      await task.save();
  
      res.json({ success: true, message: 'Task reassigned successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
  const addComment=async(req,res)=>{
    const{taskId,comment,userId}=req.body;
    try {
        //pushing comment in comments array with created by stores the userId populating created by so that we can check the role
        const task=await Task.findByIdAndUpdate(taskId,{$push:{comments:{title:comment,createdBy:userId}}},{new:true}).populate('user').populate({path:'comments.createdBy'});
         const loggedInUser= await User.findById(userId).populate({
            path: 'notifications.taskId',
            populate:{
                path:'comments.createdBy'
            },
          })
          .populate('tasks')
          .lean();;
        

         if(loggedInUser.role==='admin'){
         await User.findByIdAndUpdate(task.user._id,{$push:{notifications:{message:'New comment is added to a task',taskId:task._id}}},{new:true});
         }
         else if(loggedInUser.role==='employee'){
          await User.findByIdAndUpdate(
            task.createdBy,{$push:{notifications:{message:'New comment is added to a task',taskId:task._id,taskId:task._id}}},{new:true})
         }
        if (!task) {
            return res.json({ success: false, message: 'Task not found' });
        }
        
        res.json({success:true,message:'Comment added',user:loggedInUser})
    } catch (error) {
        console.log(error);
        
        res.json({success:false,message:'Error occured'})
    }

  }
export {createTask,deleteTask,fetchTask,fetchUserTasks,updateTask,changeUser,addComment}