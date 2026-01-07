import jwt from 'jsonwebtoken'
import User from '../models/AuthModel.js';
import multer from 'multer';

export const notFound=(req,res,next)=>{
    const error=new Error(`Route ${req.originalUrl} not found`);
    error.statusCode=404;
    next(error)
}


export const globalErrorHandler=(err,req,res,next)=>{
    const status=err.statusCode  || 500;

    res.status(status).json({
        success:false,
        message:err.message || 'something went wrong',
        status
    })
}

export const protectedRoute=async(req,res,next)=>{

    const token=req.headers.authorization?.split(' ')[1];

    if(!token) return res.status(401).json({message:"No token provided"});

    try {
        const decode=jwt.verify(token, process.env.JWT_SECRET);
        const user=await User.findById(decode.id).select('-password');

        if (!user) {
           return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        next()
    } catch (error) {
        res.status(401).json({message:"invalid or expired token"})
    }
}

export const authorize=(...roles)=>{
    return (req,res,next)=>{

        if(!roles.includes(req.user.role)){
            return res.status(401).json({
                message:`access denied: requires only [${roles.join(' ')}]`
            })
        }
        next()
    }
}

export const validate=(schema)=>(req,res,next)=>{
    const result=schema.safeParse(req.body);

    if(!result.success){
        const formattedError=result.error.format();

        return res.status(400).json({
            success:false,
            message:'validation falied',
            errors:Object.keys(formattedError).map(field =>({
                field,
                message:formattedError[field]?._errors?.[0] || 'invalid input'
            }))
        })
    }
    next();
}

const storage=multer.memoryStorage();

export const upload=multer({
    storage,
    limits:{fileSize:10*1024*1024}
})