import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';
import api from '../libs/api';
import useDebounce from '../hooks/useDebounce';
import { LuPlus } from 'react-icons/lu';
import AddExpenseModal from '../components/transactions/AddExpenseModal';
import useStore from '../store';
import { data } from 'react-router-dom';
const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]); // Needed for the "Add Expense" modal
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
    const dataVersion = useStore(state => state.dataVersion);
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  // Use the debounce hook for the search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      // Build query params based on filter state
      const params = new URLSearchParams({
        s: debouncedSearchTerm,
        df: dateRange.from,
        dt: dateRange.to,
      });

      // Corresponds to getTransactions in transactionController.js
      const response = await api.get(`/transactions?${params.toString()}`);
      setTransactions(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch transactions.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchAccounts = async () => {
    try {
      const response = await api.get('/accounts');
      setAccounts(response.data.data);
    } catch (error) {
      toast.error('Could not load accounts for expense tracking.');
    }
  };

  // Re-fetch transactions whenever the debounced search term or date range changes
  useEffect(() => {
    fetchTransactions();
  }, [debouncedSearchTerm, dateRange, dataVersion]);

  // Fetch accounts only once when the component mounts
  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleDateChange = (e) => {
    setDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Transactions
        </h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <LuPlus />
          Add Expense
        </button>
      </div>

      {/* Filter Controls */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <input
          type="search"
          placeholder="Search by description, status, source..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border p-2 sm:max-w-xs dark:bg-gray-700 dark:border-gray-600"
        />
        <div className="flex items-center gap-2">
            <label htmlFor='from' className="text-sm">From:</label>
            <input type="date" name="from" value={dateRange.from} onChange={handleDateChange} className="rounded-md border p-2 dark:bg-gray-700 dark:border-gray-600"/>
        </div>
        <div className="flex items-center gap-2">
             <label htmlFor='to' className="text-sm">To:</label>
            <input type="date" name="to" value={dateRange.to} onChange={handleDateChange} className="rounded-md border p-2 dark:bg-gray-700 dark:border-gray-600"/>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="mt-6 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold">Description</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Type</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Amount</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Source/Account</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-700">
                  {isLoading ? (
                    <tr><td colSpan="5" className="p-4 text-center">Loading transactions...</td></tr>
                  ) : transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">{tx.description}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(tx.createdat).toLocaleDateString()}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${tx.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className={`whitespace-nowrap px-3 py-4 text-sm font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(tx.amount)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{tx.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
       <AddExpenseModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} accounts={accounts} onExpenseAdded={fetchTransactions} />
    </div>
  );
};

export default Transactions;