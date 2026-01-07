import { ClipboardCheck, Search } from 'lucide-react'
import React, { useState } from 'react'
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import TransactionCard from './TransactionCard';

const TransactionList = ({ transactions=[], isLoading=false, onEditTransaction, onStatusChange   }) => {

    const [searchTerm, setSearchTerm]=useState('');

    // filter tasks based on search term
    // const filteredTasks=tasks.filter(task=>
    //     task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     (task.desc && task.desc.toLowerCase().includes(searchTerm.toLowerCase()))||
    //     (task.status && task.status.toLowerCase().includes(searchTerm.toLowerCase()))
    // );
    transactions=transactions.filter(transaction=>
        transaction.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTransactionStats=()=>{

        const total=transactions.length;

        const allTransactionsByType={
            income: transactions.filter(transaction=>transaction.type==='income').length,
            expense: transactions.filter(transaction=>transaction.type==='expense').length,
        };

        const categorizedTransactions={
            // all: filteredTasks,
            // pending: filteredTasks.filter(task=>task.status==='pending'),
            // inProgress: filteredTasks.filter(task=>task.status==='in-progress'),
            // completed: filteredTasks.filter(task=>task.status==='completed')
            all: transactions,
            income: transactions.filter(transaction=>transaction.type==='income'),
            expense: transactions.filter(transaction=>transaction.type==='expense'),
        }

        const { income, expense } = allTransactionsByType;

        return {total, income, expense, categorizedTransactions};
    }

    const {total, income, expense, categorizedTransactions}=getTransactionStats();

    const TransactionGrid=({transactions, emptyMessage})=>{
        if(transactions.length===0){
            return (
            <div className='text-center text-muted-foreground py-10'>
                <div className='max-w-md mx-auto'>
                    <ClipboardCheck className='mx-auto h-8 w-8 mb-2 text-muted-foreground'/>
                    <h3 className='text-sm mt-4 text-foreground font-medium'>No Transactions Found</h3>
                    <p className='mt-2 text-sm text-muted-foreground'>{emptyMessage}</p>
                </div>
            </div>
            );
        }

        return (

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {transactions.map((transaction)=>(
                <TransactionCard
                    key={transaction._id}
                    transaction={transaction}
                    onEdit={onEditTransaction}
                    onStatusChange={onStatusChange}
                />
            ))}
        </div>);
    }
  return (
    <div className='p-4 space-y-4'>
        {/* Task items will be rendered here */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='bg-card p-4 rounded-lg border shadow-sm'>
                <div className='flex items-center justify-between'>
                    <p className='font-medium text-sm text-muted-foreground'>Total</p>
                    <ClipboardCheck className='h-4 w-4 text-muted-foreground'/>
                </div>
                <p className='mt-2 text-2xl font-semibold'>{total}</p>
            </div>
            <div className='bg-card p-4 rounded-lg border shadow-sm'>
                <div className='flex items-center justify-between'>
                    <p className='font-medium text-sm text-muted-foreground'>Income</p>
                    <div className='h-2 w-2 rounded-full bg-yellow-500'></div>
                </div>
                <p className='mt-2 text-2xl font-semibold text-yellow-600'>{income}</p>
            </div>
            <div className='bg-card p-4 rounded-lg border shadow-sm'>
                <div className='flex items-center justify-between'>
                    <p className='font-medium text-sm text-muted-foreground'>Expense</p>
                    <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                </div>
                <p className='mt-2 text-2xl font-semibold text-blue-600'>{expense}</p>
            </div>
        </div>

        {/* search and filter can go here */}
        <div className='flex items-center gap-4'>
            <div className='relative flex-1 max-w-md'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground'/>
                <Input
                    type='text'
                    placeholder='Search tasks...'
                    value={searchTerm}
                    onChange={(e)=>setSearchTerm(e.target.value)}
                    className='pl-10'
                />
            </div>
        </div>

        {/* tabs */}
        <Tabs defaultValue="all" className='space-y-4 w-full'>
            <TabsList className='w-full grid grid-cols-4 bg-muted p-1 rounded-lg'>
                <TabsTrigger className='cursor-pointer' value="all">
                    All
                    <Badge className='ml-2 bg-secondary text-secondary-foreground'>{total}</Badge>
                </TabsTrigger>
                <TabsTrigger className='cursor-pointer' value="income">
                    Income
                    <Badge className='ml-2 bg-yellow-100 text-yellow-800'>{income}</Badge>
                </TabsTrigger>
                <TabsTrigger className='cursor-pointer' value="expense">
                    Expense
                    <Badge className='ml-2 bg-blue-100 text-blue-800'>{expense}</Badge>
                </TabsTrigger>
            </TabsList> 
            <TabsContent value="all">
                <TransactionGrid
                    transactions={categorizedTransactions.all}
                    emptyMessage="No tasks match your search criteria. Please try again with different keywords."
                />
            </TabsContent>
            <TabsContent value="income">
                <TransactionGrid
                    transactions={categorizedTransactions.income}
                    emptyMessage="You have no income transactions. Add new income transactions to see them here!"
                />
            </TabsContent>
            <TabsContent value="expense">
                <TransactionGrid
                    transactions={categorizedTransactions.expense}
                    emptyMessage="You have no expense transactions. Add new expense transactions to see them here!"
                />
            </TabsContent>
        </Tabs>
    </div>
  )
}

export default TransactionList
