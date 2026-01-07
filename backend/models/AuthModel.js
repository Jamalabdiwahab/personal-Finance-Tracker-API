import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema=new mongoose.Schema({
    name:{ type:String, required:true},
    email:{
        type:String,
        required:true, 
        unique:true
    },
    password:{type:String, required:true},
    profile:{
        type:String, 
        default:null
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }
})

userSchema.pre('save',async function() {
  
    if(!this.isModified('password')) return;

    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})

userSchema.methods.comparePassword=function(inputPassword){
    return bcrypt.compare(inputPassword,this.password);
}

const User=mongoose.model('User',userSchema);
export default User;