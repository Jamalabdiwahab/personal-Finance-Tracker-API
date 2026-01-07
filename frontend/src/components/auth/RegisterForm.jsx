import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import api from '@/lib/API/APIClient'
import { extractErrorMessage } from '@/util/errorUtil'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'

const RegisterForm = () => {

     const navigate=useNavigate();
    const [errors,setErrors]=useState(null);

    
    const [formValues,setFormValues]=useState({
        name:'',
        email:'',
        password:'',
        confirmPassword:''
    });

    const registerForm=useMutation({
        mutationFn:async(newUser)=>{
            const response= await api.post('/auth/register',newUser);
            return response.data;
        },
        onSuccess: (data)=>{
            console.log('data: ',data);
            toast.success('Registration successful! You are now logged in.');
            navigate('/dashboard');
        },
        onError:(error)=>{
            setErrors(extractErrorMessage(error));
        }
    })

    const pending=registerForm.isPending;
   

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setFormValues({
            ...formValues,
            [name]:value
        });
    }

    const handleSubmit=(e)=>{
        e.preventDefault();

        // form validation
        if(!formValues.name || !formValues.email || !formValues.password || !formValues.confirmPassword){
            setErrors("All fields are required.");
            return;
        }

        if(formValues.password !== formValues.confirmPassword){
            setErrors("Passwords do not match.");
            return;
        }
        
        // trigger registration mutation
        registerForm.mutate(formValues);
        setErrors(null);
    }
  return (
    <Card className='w-full border-border'>
        <CardHeader className='space-y-2 text-center pb-4'>
            <CardTitle className='text-2xl font-semibold'>Create an account</CardTitle>
            <CardDescription className='text-sm text-muted-foreground'>Join us today! It takes only a few steps to create your account and start managing your finances effectively.    
            </CardDescription>

            <div className='max-w-60 mx-auto '>
                {errors && <p className='text-sm bg-destructive/10 rounded-md text-center px-4 py-2 text-destructive mb-2'>{errors}</p>}
            </div>
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <div className='mb-2'>
                        <label 
                            htmlFor="name"
                            className='text-left text-sm block mb-2 font-medium'
                        >Name</label>
                        <Input
                            type="text"
                            id='name'
                            name='name'
                            value={formValues.name}
                            onChange={handleChange}
                            placeholder='Enter your name'
                            required
                        />
                    </div>
                    <div className='mb-2'>
                        <label 
                            htmlFor="email"
                            className='text-left text-sm block mb-2 font-medium'
                        >Email</label>
                        <Input
                            type="email"
                            id='email'
                            name='email'
                            value={formValues.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                            required
                        />
                    </div>
                    <div className='mb-2'>
                        <label 
                            htmlFor="password"
                            className='text-left text-sm block mb-2 font-medium'
                        >Password</label>
                        <Input
                            type="password"
                            id='password'
                            name='password'
                            value={formValues.password}
                            onChange={handleChange}
                            placeholder='**************'
                            required
                        />
                    </div>
                    <div className='mb-2'>
                        <label 
                            htmlFor="confirmPassword"
                            className='text-left text-sm block mb-2 font-medium'
                        >Confirm Password</label>
                        <Input
                            type="password"
                            id='confirmPassword'
                            name='confirmPassword'
                            value={formValues.confirmPassword}
                            onChange={handleChange}
                            placeholder='**************'
                            required
                        />
                    </div>
                    <Button className='w-full mt-4' type='submit' disabled={pending}>
                        {
                            pending ? (
                                <span className='flex -items-center gap-2'><LoaderCircle/>Creating account...</span>
                            ) : ('Create account')
                        }

                    </Button>
                </CardContent>
                <CardFooter className='flex flex-col gap-2 mt-4'>
                  <p className='text-sm text-muted-foreground'>Already have an account?<Link to={'/login'} className='text-sm text-primary underline cursor-pointer'>Sign In</Link></p>
                   <p className='text-sm text-muted-foreground text-center mt-4'>
                        By clicking "Create account", you agree to our <span className='text-primary underline cursor-pointer'>Terms of Service</span> and <span className='text-primary underline cursor-pointer'>Privacy Policy</span>.
                     </p>

                </CardFooter>
            </form>
        </CardHeader>
    </Card>
  )
}

export default RegisterForm
