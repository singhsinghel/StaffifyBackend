import express from 'express';
import { createUser, deleteNoti, fetchUser, fetchUsers, login, signIn, switchRole } from '../controllers/userController.js';
import authMiddleware from '../middlewares/middleware.js';

const userRouter=express.Router();

userRouter.post('/create',authMiddleware,createUser);
userRouter.post('/signin',signIn);
userRouter.post('/login',login);
userRouter.get('/fetch',fetchUsers);
userRouter.get('/fetch/user',fetchUser)
userRouter.post('/switchRole',authMiddleware,switchRole);
userRouter.post('/deleteNoti',authMiddleware,deleteNoti);

export default userRouter;