import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDb from './config/connectDB.js';
import userRouter from './routes/userRoutes.js';
import taskRouter from './routes/taskRoute.js';


const app=express();
const port=process.env.PORT||8080;
app.use(express.json());
app.use(cors());

connectDb();

app.use('/api/user',userRouter);
app.use('/api/task',taskRouter);
app.get('/',(req,res)=>{
    res.send('hii')
})

app.listen(port,()=>{
    console.log('server is listening');
})