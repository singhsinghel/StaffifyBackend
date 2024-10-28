import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const userSchema = new Schema({

  name:{
    type:String,
    trim:true,
    required:true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  gender:{
    type:String,
    enum:['male','femail','other']
  },
  tasks:[{
    type:Schema.Types.ObjectId,
    ref:'Task'
  }],
  role: {
    type: String,
    enum: ['employee', 'admin'],
    default: 'employee'
  },
  city:{
    type:String,
    required:true,
  },
  post:{
    type:String,
    required:true,
  },
  mobile:{
    type:Number,
    required:true,
  },
  birthDay:{
    type:Date,
  },
  whatsapp:{
    type:Number,
    required:true,
  },
  socials:{
    github:{
      type:String
    },
    linkedIn:{
      type:String
    },
  },
  admin:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  notifications:[{
    message:{
      type:String
    },
    isRead:{
      type:Boolean,
      default:false
    },
    createdAt:{
      type:Date,
      default:Date.now()
    },
    taskId:{
      type:Schema.Types.ObjectId,
      ref:'Task',
      default:null
    }
  }
  ]
});

const User =  mongoose.model('User', userSchema);

export  default User;
