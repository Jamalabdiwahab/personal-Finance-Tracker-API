import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Calendar, Edit, Loader, MoreVertical, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/API/APIClient";


const STATUS_CONFIG = {
    'income': {
        variant: 'secondary',
        label: 'Income',
        color: 'text-yellow-600'
    },
    'expense': {
        variant: 'default',
        label: 'Expense',
        color: 'text-blue-600'
    },
};
const TransactionCard = ({transaction,onEdit, isLoading=false}) => {

    const [deleteLoading,setDeleteLoading]=useState(false);
    const [showDeleteConfirm,setShowDeleteConfirm]=useState(false);

    const statusConfig= STATUS_CONFIG[transaction.type] || STATUS_CONFIG['income'];

    const formatDate=(dateString)=>{
        if(!dateString) return 'N/A';
        const options={year:'numeric', month:'short', day:'numeric'};
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    
    const formattedDueDate=formatDate(transaction.createdAt);

    const queryClient=useQueryClient()
    const deleteMutation=useMutation({
        mutationFn:async ()=>{
            const response=await api.delete(`/transactions/${transaction._id}`)
            return response.data
        },
        onSuccess:()=>{
            queryClient.invalidateQueries(['transactions']);
            toast.success('Task deleted successfully')
        },
        onError:(err)=>{
            toast.error(`error deleting task: ${err.message}`)
            console.error('error message:',err);
        }
    })

    const handleDeleteConfirm=async()=>{
        try {
            await deleteMutation.mutateAsync(transaction._id)
            setShowDeleteConfirm(false)
        } catch (error) {
            console.error('error confirming delete: ',error);
            toast.error(`error confirming delete: ${error.message}`)
            
        }
    }
  return (
    <>
    <Card className='w-full transition-shadow hover:shadow-md'>
        <CardHeader className=''>
           <div className='flex items-center justify-between'>
              <CardTitle className='text-lg font-semibold leading-tight'>{transaction.title}</CardTitle>

              <div className="flex items-center gap-2">
                <Badge variant={statusConfig.variant} className='shrink-0'>
                    {statusConfig.label}
                </Badge>

                {/* drop down menu */}
                <DropdownMenu>
                    {/* DropdownMenuTrigger and DropdownMenuContent would go here */}
                    <DropdownMenuTrigger asChild>
                        <Button 
                           variant="ghost" 
                           size="sm"
                        //    disabled={isLoading}
                           className='h-8 w-8 p-0 rounded-full'
                        >
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                            onClick={() => onEdit(transaction)}   
                        >
                            <Edit/>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={()=> setShowDeleteConfirm(true)}   
                            className="text-destructive"
                       >
                           <Trash/>
                            Delete
                       </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
        </CardHeader>
        <CardContent className='pt-0'>
            <div className='flex flex-col gap-4 mb-4'>
                <div className='flex items-center gap-2 text-sm font-medium'>
                    <span>Amount: ${transaction.amount}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className='h-4 w-4'/>
                    <span className='text-sm text-muted-foreground'>Date: {formattedDueDate}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Category: {transaction.category}</span>
                    <span className={statusConfig.color}>{statusConfig.label}</span>

                </div>
            </div>
        </CardContent>

    </Card>

    {/* Delete Confirmation */}
    {showDeleteConfirm && (
        <AlertDialog
            open={showDeleteConfirm} 
            onOpenChange={setShowDeleteConfirm}
        >
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>
                    Are you sure you want to delete the task "{transaction.title}"? This action cannot be undone.                  
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel asChild>
                    <Button variant={"outline"} disabled={deleteLoading}>
                        Cancel  
                    </Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                    <Button
                        variant={"destructive"}
                        disabled={deleteLoading}
                        onClick={handleDeleteConfirm}
                    >
                        {deleteMutation.isPending ? (
                            <span className="flex items-center gap-2">
                                <Loader size='sm'/>
                                Deleting...
                            </span>
                        ):(
                            'Delete'
                        )}
                    </Button>
                </AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

    }

    </>
  )
}

export default TransactionCard
