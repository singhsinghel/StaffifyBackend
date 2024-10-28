import express from 'express';
import {  addComment, changeUser, createTask, deleteTask, fetchTask, fetchUserTasks, updateTask } from '../controllers/taskController.js';
import authMiddleware from '../middlewares/middleware.js';
const taskRouter=express.Router();

taskRouter.post('/create',authMiddleware,createTask);
taskRouter.delete('/delete',authMiddleware,deleteTask);
taskRouter.get('/fetch',fetchTask);
taskRouter.get('/fetch/user',authMiddleware,fetchUserTasks);
// taskRouter.post('/accept',authMiddleware,acceptTask);
taskRouter.put('/update',authMiddleware,updateTask);
taskRouter.post('/changeUser',authMiddleware,changeUser);
taskRouter.post('/addComment',authMiddleware,addComment);

export default taskRouter