import z from "zod";

 export const createUserSchema=z.object({
    name:z.string().min(3,'name is required'),
    email:z.string().email('email must be valid'),
    password:z.string()
       .min(5, 'Password must be at least 5 characters')
       .max(20,'password must be at most 20 characters')
 })