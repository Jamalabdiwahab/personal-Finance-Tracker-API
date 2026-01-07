import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import MonthlySummary from '../Transactions/MonthlySummary'
import DashboardOverview from './DashboardOverview'

const WelcomeDashbaord = ({onCreateTask}) => {
  return (
    <Card className='border-0 shadow-md bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-blue-950'>
        <CardHeader className='px-6 py-8'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div className='space-y-2 flex flex-col items-start'>
                    <CardTitle className='text-2xl font-semibold'>
                        Welcome to Your Personal Finance Tracker!
                    </CardTitle>
                    <CardDescription className='text-muted-foreground'>
                        Get started by creating a new transaction to track your expenses and income effectively.
                    </CardDescription>   
                </div>
                <Button variant='' size='lg' onClick={onCreateTask}>
                    Create New Transaction
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            {/* card status */}
            <DashboardOverview/>

            {/* monthly summary */}
            <MonthlySummary/>
        </CardContent>

    </Card>
  )
}

export default WelcomeDashbaord
