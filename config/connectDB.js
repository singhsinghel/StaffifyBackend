import mongoose from 'mongoose'
import 'dotenv/config'

const connectDb=()=>{
    mongoose.connect(process.env.URI).then(()=>console.log('db connected'));
}
export default connectDb;