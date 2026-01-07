import DashboardHeader from '@/components/dashboard/DashboardHeader'
import WelcomeDashbaord from '@/components/dashboard/WelcomeDashbaord'
import TransactionFormDialog from '@/components/Transactions/TransactionFormDialog';
import TransactionList from '@/components/Transactions/TransactionList';
import api from '@/lib/API/APIClient';
import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { useState } from 'react';

const DashboardPage = () => {

  const [showCreateTransactionDialog, setShowCreateTransactionDialog] =useState(false);
  const [editTransactionData, setEditTransactionData] =useState(null);

  const handleClose=()=>{
    setShowCreateTransactionDialog(false);
    setEditTransactionData(null);
  }

  const transactionQueryData=useQuery({
    queryKey:['transactions'],
    queryFn: async ()=>{
      const response=await api.get('/transactions');
      return response.data;
    },
    retry:1,
  }) // TODO: fetch tasks data from backend

  console.log("transaction data: ",transactionQueryData.data);



  if(transactionQueryData.isLoading){
    return <div className='flex h-screen items-center justify-center'>
      <Loader className='animate-spin'/>
    </div>
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* header */}
      <DashboardHeader/>
      {/* main content */}
      <main className='max-w-6xl mx-auto pt-25'>

        {/* welcome section */}
        <WelcomeDashbaord
          onCreateTask={()=>setShowCreateTransactionDialog(true)}
        />
        {/* transaction section */}
        {/* tasks section */}
        <TransactionList
          transactions={transactionQueryData.data.transactions || []}
          isLoading={transactionQueryData.isLoading}
          onEditTransaction={(transaction)=>setEditTransactionData(transaction)}
        />
      </main>
      <TransactionFormDialog
        transaction={editTransactionData}
        open={showCreateTransactionDialog || !!editTransactionData}
        onOpenChange={handleClose}
      />
      
    </div>
  )
}

export default DashboardPage
