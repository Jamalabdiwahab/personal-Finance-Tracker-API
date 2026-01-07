import LoginForm from '@/components/auth/LoginForm'
import React from 'react'

const LoginPage = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-background'>
        <div className='absolute inset-0 bg-linear-to-br from-secondary to-secondary/20 opacity-50'/>
        <div className='z-10 w-full max-w-md mx-auto px-4'>
            <LoginForm/>
        </div>
    </div>
  )
}

export default LoginPage
