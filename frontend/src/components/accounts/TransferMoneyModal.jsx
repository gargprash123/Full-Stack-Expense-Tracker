import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import api from '../../libs/api';
import Modal from '../ui/Modal';

const schema = z.object({
  from_account: z.string().min(1, "Please select an account to transfer from"),
  to_account: z.string().min(1, "Please select an account to transfer to"),
  amount: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Amount must be positive")
  ),
}).refine(data => data.from_account !== data.to_account, {
    message: "Cannot transfer to the same account",
    path: ["to_account"],
});

const TransferMoneyModal = ({ isOpen, onClose, accounts, onTransferSuccess }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      // Corresponds to PUT /api-v1/transactions/transfer-money
      await api.put('/transactions/transfer-money', data);
      toast.success("Transfer completed successfully!");
      onTransferSuccess();
      reset();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Transfer failed.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transfer Money Between Accounts">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
            <label htmlFor="from_account">From</label>
            <select id="from_account" {...register("from_account")} className="w-full rounded-md border p-2 dark:bg-gray-700">
                <option value="">Select Account</option>
                {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.account_name} ({acc.account_number})</option>)}
            </select>
            {errors.from_account && <p className="text-red-500 text-sm">{errors.from_account.message}</p>}
        </div>
        <div>
            <label htmlFor="to_account">To</label>
            <select id="to_account" {...register("to_account")} className="w-full rounded-md border p-2 dark:bg-gray-700">
                <option value="">Select Account</option>
                {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.account_name} ({acc.account_number})</option>)}
            </select>
            {errors.to_account && <p className="text-red-500 text-sm">{errors.to_account.message}</p>}
        </div>
        <div>
          <label htmlFor="amount">Amount to Transfer</label>
          <input id="amount" type="number" step="0.01" {...register("amount")} className="w-full rounded-md border p-2 dark:bg-gray-700"/>
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={onClose} className="rounded-md bg-gray-200 px-4 py-2 text-gray-800">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="rounded-md bg-indigo-600 px-4 py-2 text-white disabled:bg-indigo-400">
            {isSubmitting ? 'Transferring...' : 'Confirm Transfer'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransferMoneyModal;