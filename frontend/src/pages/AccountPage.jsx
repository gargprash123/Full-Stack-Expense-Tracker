import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../libs/api';
import { LuPlus, LuLandmark } from 'react-icons/lu';
import useStore from '../store';
// Import Modal Components
import CreateAccountModal from '../components/accounts/CreateAccountModal';
import AddMoneyModal from '../components/accounts/AddMoneyModal';
import TransferMoneyModal from '../components/accounts/TransferMoneyModal';

const AccountPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(null);
    const dataVersion = useStore(state => state.dataVersion);
  // State to manage modals
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isAddMoneyOpen, setAddMoneyOpen] = useState(false);
  const [isTransferOpen, setTransferOpen] = useState(false);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      // Corresponds to getAccounts in accountController.js
      const response = await api.get('/accounts');
      setAccounts(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch accounts.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [dataVersion]);
  
  const handleOpenAddMoney = (account) => {
    setSelectedAccount(account);
    setAddMoneyOpen(true);
  };
  
  if (isLoading) return <div className="p-4 text-white">Loading accounts...</div>;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          My Accounts
        </h1>
        <div className="flex gap-2">
            <button
              onClick={() => setTransferOpen(true)}
              className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              Transfer Money
            </button>
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <LuPlus />
              Create Account
            </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map(account => (
          <div key={account.id} className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className='flex items-center gap-3'>
                <LuLandmark className="h-8 w-8 text-indigo-500" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{account.account_name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{account.account_number}</p>
                </div>
              </div>
               <button 
                onClick={() => handleOpenAddMoney(account)}
                className="rounded-md bg-green-500 px-3 py-1 text-xs font-medium text-white hover:bg-green-600">
                Add Money
              </button>
            </div>
            <p className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(account.account_balance)}
            </p>
          </div>
        ))}
      </div>
      
      {/* Modals */}
      <CreateAccountModal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)} onAccountCreated={fetchAccounts} />
      <AddMoneyModal isOpen={isAddMoneyOpen} onClose={() => setAddMoneyOpen(false)} account={selectedAccount} onMoneyAdded={fetchAccounts} />
      <TransferMoneyModal isOpen={isTransferOpen} onClose={() => setTransferOpen(false)} accounts={accounts} onTransferSuccess={fetchAccounts} />
    </div>
  );
};

export default AccountPage;