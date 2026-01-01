import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from "mongoose";
import helmet from "helmet";
import authRoutes from './routes/AuthRoute.js'
import transactionRoutes from './routes/transactionRoute.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger.js';
import { globalErrorHandler, notFound } from "./middlewares/middlewares.js";

dotenv.config();
const app=express();
const PORT=process.env.PORT;
const NODE_ENV=process.env.NODE_ENV
app.use(helmet());
app.use(express.json());
app.use(cors(
    {
        origin:'http://localhost:5000'
    }
))

if(NODE_ENV == 'development'){
    app.use(morgan('dev'))
}

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth',authRoutes)
app.use('/transactions',transactionRoutes)

app.use(notFound)
app.use(globalErrorHandler)
console.log("Mongo URI exists:", !!process.env.MONGO_URI_PRO);


const startSever=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI_PRO, {
            serverSelectionTimeoutMS:30000
        })
        console.log('✅ MongoDB connected');

        app.listen(PORT,()=>{
            console.log(`🚀 Server running on port ${PORT}`);
        })
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
}
startSever()