import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import api from '../../libs/api';
import Modal from '../ui/Modal';
import useStore from '../../store';

const schema = z.object({
  account_id: z.string().min(1, "Please select an account"),
  description: z.string().min(3, "Description is required"),
  source: z.string().min(2, "Source/Payee is required"),
  amount: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Amount must be positive")
  ),
});

const AddExpenseModal = ({ isOpen, onClose, accounts, onExpenseAdded }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
  });

// Get the refresh action from the store
  const refreshData = useStore(state => state.refreshData);

  const onSubmit = async (data) => {
    try {
      const { account_id, ...payload } = data;
      // Corresponds to POST /api-v1/transactions/add-transaction/:account_id
      await api.post(`/transactions/add-transaction/${account_id}`, payload);
      toast.success("Expense added successfully!");
      onExpenseAdded(); // This will refetch the transactions list
        refreshData(); // Signal that data has changed
      reset();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add expense.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Expense">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-white">
        <div>
            <label htmlFor="account_id">From Account</label>
            <select id="account_id" {...register("account_id")} className="w-full rounded-md border p-2 dark:bg-gray-700">
                <option value="">Select an Account</option>
                {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.account_name} ({acc.account_number})</option>)}
            </select>
            {errors.account_id && <p className="text-red-500 text-sm">{errors.account_id.message}</p>}
        </div>
        <div>
          <label htmlFor="description">Description (e.g., Groceries)</label>
          <input id="description" {...register("description")} className="w-full rounded-md border p-2 dark:bg-gray-700"/>
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>
        <div>
          <label htmlFor="source">Source / Payee (e.g., Supermarket)</label>
          <input id="source" {...register("source")} className="w-full rounded-md border p-2 dark:bg-gray-700"/>
          {errors.source && <p className="text-red-500 text-sm">{errors.source.message}</p>}
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <input id="amount" type="number" step="0.01" {...register("amount")} className="w-full rounded-md border p-2 dark:bg-gray-700"/>
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={onClose} className="rounded-md bg-gray-200 px-4 py-2 text-gray-800">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="rounded-md bg-indigo-600 px-4 py-2 text-white disabled:bg-indigo-400">
            {isSubmitting ? 'Adding...' : 'Add Expense'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddExpenseModal;