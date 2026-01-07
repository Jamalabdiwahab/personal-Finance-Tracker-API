import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import api from '@/lib/API/APIClient'
import { extractErrorMessage } from '@/util/errorUtil'
import { LoaderCircle } from 'lucide-react'
import useAuthStore from '@/lib/store/authStore'

const LoginForm = () => {

    const { setAuthData }=useAuthStore()
    const navigate=useNavigate();

    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
    })

    const loginMutation =useMutation({
        mutationFn: async (credentials) => {
            const response = await api.post('/auth/login',credentials);
            console.log("response",response);
            return response.data;
        },
        onSuccess: (data) => {
            
            if(data.token){
                const {token,user}=data;
                setAuthData(token,user);
                // Navigate to dashboard or home page after login
                navigate('/dashboard');

            }
        },
        onError: (error) => {
            // Handle registration error
            console.error("Login error:", error);
            setErrors(extractErrorMessage(error));
        }
    });

    const pending=loginMutation.isPending;

    const [errors, setErrors] = useState(null);

    const handleChange=(e)=>{
        const {name, value}=e.target;

        setFormValues({
            ...formValues,
            [name]:value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // Form validation
        if(!formValues.email || !formValues.password) {
            setErrors("All fields are required");
            return;
        }

        // Submit form logic here
        loginMutation.mutate(formValues);
        setErrors(null);

    }
  return (
    <Card className='w-full border-border'>
        <CardHeader className='space-y-2 text-center pb-4'>
            <CardTitle className='text-2xl font-semibold'>Welcome Back</CardTitle>
            <CardDescription className='text-sm text-muted-foreground'>Sign in to your account to continue managing your finances effectively.
            </CardDescription>

            <div className='max-w-60 mx-auto '>
                {errors && <p className='text-sm bg-destructive/10 rounded-md text-center px-4 py-2 text-destructive mb-2'>{errors}</p>}
            </div>
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <div className='mb-2'>
                        <label 
                            htmlFor="email"
                            className='text-left text-sm block mb-2 font-medium'
                        >Email</label>
                        <Input
                            type="text"
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
                    <Button className='w-full cursor-pointer mt-4' type='submit' disabled={pending}>
                        {pending ? (<span className='flex -items-center
                        gap-2'><LoaderCircle/>'Signing in...'</span>) : ('Sign In')}
                    </Button>
                </CardContent>
                <CardFooter className='flex flex-col gap-2 mt-4'>
                  <p className='text-sm text-muted-foreground'>Don't have an account?<Link to={'/register'} className='text-sm text-primary underline cursor-pointer'>Sign Up</Link></p>
                </CardFooter>
            </form>
        </CardHeader>
    </Card>
  )
}

export default LoginForm
