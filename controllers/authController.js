import User from "../models/AuthModel.js";
import cloudinary from "../utils/cloudinary.js";
import { generateToken } from "../utils/generateToken.js";

export const registerNewUser=async(req,res,next)=>{

    let { name, email, password, role }=req.body;

    try {
        email=email.toLowerCase();
        const exists=await User.findOne({email});

        if(exists) return res.status(400).json({message:"Email already exists. Please use new one"});

        const user=await User.create({name,email,password,role});
        const token=generateToken(user._id);
        res.status(201).json({token})
        
    } catch (error) {
        next(error)
    }
}

export const login=async(req,res,next)=>{
    let {email,password}=req.body;

    try {
        email=email.toLowerCase();

        const user=await User.findOne({email})

        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({message:"invalid email or password"});
        }

        const token=generateToken(user._id)
        res.json({token},{user})
    } catch (error) {
        next(error)
    }
}

export const uploadFile=(req,res,next)=>{

    if(!req.file){
        return res.status(400).json({message:"No file uplaoded"})
    }

    const stream=cloudinary.uploader.upload_stream(
        {
            folder:"qowdhan_uploads",
            resource_type:"auto"
        },
        async (error,result)=>{
            if(error) return next(error);

            await User.findByIdAndUpdate(req.user._id, {
                profile:result.secure_url
            })
            res.status(201).json({
                success:true,
                fileUrl:result.secure_url
            })
        }
    )

    stream.end(req.file.buffer)
}