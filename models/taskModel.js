import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Task schema
const taskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  newTask: {
    type: Boolean,
    default: true
  },
  status:{
    type:String,
    default:''
  },
  date: {
    type: Date,
    required: true
  },
  createdAt:{
    type:Date,
    default:Date.now()
  },
  accepted:{
    type:Boolean,
    default:false
  },
  category: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdBy:{
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  comments:[{
    title:{
      type:String,
      required:true,
    },
    createdAt:{
     type:Date,
     default:Date.now()
    },
    createdBy:{
      type:Schema.Types.ObjectId,
      ref:'User'
    }
  }]
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
