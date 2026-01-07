
import useAuthStore from '@/lib/store/authStore'
import { ClipboardCheck } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button';
import { useQueryClient } from '@tanstack/react-query';

const DashboardHeader = () => {
    const { user, clearAuthData } =useAuthStore();
    console.log("user in header: ",user);

    const queryClient=useQueryClient();

    const handleLogout=()=>{
        if(window.confirm('Are you sure you want to logout?')){
            clearAuthData();
            queryClient.clear();
            window.location.reload();
        }
    }
  return (
    <header className='bg-card border-b border-border shadow-md fixed top-0 left-0 right-0 z-10'>
        <div className='px-12 py-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
                <div className='flex w-8 h-8 items-center justify-center rounded-lg bg-primary'>
                    <ClipboardCheck className='h-4 w-4 text-primary-foreground'/>
                </div>
                <div className='flex flex-col'>
                  <h1 className='text-xl font-semibold text-foreground'>Personal Finance Tracker </h1>
                  <p className='text-sm text-muted-foreground'>Manage your finances effectively</p>
                </div>
            </div>
            <div className='flex items-center gap-4'>
                <span className='text-sm text-muted-foreground'>
                    Welcome back, <span className='text-foreground font-medium'>{user?.name || 'User!'}</span>
                </span>
                <Button variant='outline' size='sm' onClick={handleLogout}>
                    Logout
                </Button>
            </div>
        </div>
    </header>
  )
}

export default DashboardHeader
