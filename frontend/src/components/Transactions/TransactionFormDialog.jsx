import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { extractErrorMessage } from '@/util/errorUtil';
import { toast } from 'sonner';
import api from '@/lib/API/APIClient';

const TransactionFormDialog = ({transaction, open=true, onOpenChange}) => {
    const [formValues, setFormValues] = useState({
        title: '',
        amount:'',
        type:'income',
        category:'',
    });

    const [validationErrors, setValidationErrors]=useState(null);

    useEffect(()=>{
        if(transaction){
            setFormValues({
                title: transaction.title || '',
                amount: transaction.amount || '',
                type: transaction.type || 'income',
                category: transaction.category || '',
            });
        }else{
            setFormValues({
                title: '',
                amount:'',
                type:'income',
                category:'',
            });
        }

        setValidationErrors(null);
    },[transaction,open]);

    const queryClient=useQueryClient()

    const handleChange=(e)=>{
        const {name, value}=e.target;
        setFormValues({
            ...formValues,
            [name]:value
        })        
    }

    //  create task mutation logic here
    const createTaskMutation =useMutation({
        mutationFn: async (newTask) => {
            const response = await api.post('/transactions', newTask);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['transactions']);
            onOpenChange(false); // close the dialog
        },
        onError: (error) => {
            console.error("Error creating task:", error);
        }
    })

    const updateTaskMutation =useMutation({
        mutationFn: async (updatedTransaction) => {
            const response = await api.put(`/transactions/${transaction._id}`, updatedTransaction);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['transactions']);
            toast.success('Task updated successfully');
            onOpenChange(false); // close the dialog
        },
        onError: (error) => {
            console.error("Error updating task:", error);
            toast.error(`Error updating task: ${extractErrorMessage(error)}`);
        }
    })

    const handleSubmit=(e)=>{
        e.preventDefault();
        // validate form data
        if(!formValues.title){
            setValidationErrors("Title is required");
            return;
        }

        const transactionData={
            title: formValues.title,
            amount: formValues.amount,
            type: formValues.type,
            category: formValues.category,
        }
        if(transaction){
            // update existing task
            updateTaskMutation.mutate(transactionData);
            setFormValues('')
            return;
        }else{
            createTaskMutation.mutate(transactionData);
            setFormValues('')
        }

    }

    // get display error from validationErrors or mutation error
    const displayError=validationErrors || 
    extractErrorMessage(createTaskMutation.error)||
    extractErrorMessage(updateTaskMutation.error);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-125'>
            <DialogHeader>
                <DialogTitle className='text-lg font-semibold text-center'>
                    {transaction ? 'Edit Transaction' : 'Create New Transaction'}
                </DialogTitle>
                <DialogDescription className='text-center mb-4 text-muted-foreground'>
                    {transaction ? 'Update the details of your transaction below.' : 'Fill in the details of your new transaction below.'}
                </DialogDescription>
            </DialogHeader>

            {
                displayError && (
                    <div className='mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded'>
                        {displayError}
                    </div>
                )
            }

            {/* form content */}
            <form onSubmit={handleSubmit}>
                <div className='mb-2'>
                    <label className='block text-sm font-medium mb-2 text-left'>Title *</label>
                    <Input 
                        type='text' 
                        name="title" 
                        value={formValues.title}
                        onChange={handleChange}
                        placeholder="Transaction Title" 
                        required
                   />
                </div>
                <div className='mb-2'>
                    <label className='block text-sm font-medium mb-2 text-left'>Amount *</label>
                    <Input 
                        type='number' 
                        name="amount" 
                        value={formValues.amount}
                        onChange={handleChange}
                        placeholder="Ammount"
                        required
                   />
                </div>
                <div className='mb-2'>
                    <label className='block text-sm font-medium mb-2 text-left'>Type</label>
                    <Select
                        name="type" 
                        value={formValues.type}
                        onValueChange={(value)=>setFormValues({...formValues, type:value})}
                    >
                       <SelectTrigger className='w-full mb-2'>
                          <SelectValue placeholder="Select Status"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className='mb-2'>
                    <label className='block text-sm font-medium mb-2 text-left'>Category *</label>
                    <Input 
                        type='text' 
                        name="category" 
                        value={formValues.category}
                        onChange={handleChange}
                        placeholder="Category" 
                        required
                   />
                </div>

                <DialogFooter className='mt-4 flex gap-2 items-center justify-end'>
                    <Button variant='outline' size='sm' onClick={()=>onOpenChange(false)}>Cancel</Button>
                    <Button type='submit' size='sm'>
                        {transaction ? (updateTaskMutation.isLoading ? 'Updating...' : 'Update Transaction')
                        :
                        (createTaskMutation.isLoading ? 'Creating...' : 'Create Transaction')
                        }
                    </Button>
                </DialogFooter>

            </form>

        </DialogContent>
    </Dialog>
  )
}

export default TransactionFormDialog
