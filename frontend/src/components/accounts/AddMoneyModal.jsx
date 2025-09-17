import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import api from '../../libs/api';
import Modal from '../ui/Modal';

const schema = z.object({
  amount: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Amount must be positive")
  ),
});

const AddMoneyModal = ({ isOpen, onClose, account, onMoneyAdded }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!account) return;
    try {
      // Corresponds to PUT /api-v1/accounts/add-money/:id
      await api.put(`/accounts/add-money/${account.id}`, data);
      toast.success("Money added successfully!");
      onMoneyAdded();
      reset();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add money.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Money to ${account?.account_name}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="amount">Amount to Deposit</label>
          <input id="amount" type="number" step="0.01" {...register("amount")} className="w-full rounded-md border p-2 dark:bg-gray-700"/>
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={onClose} className="rounded-md bg-gray-200 px-4 py-2 text-gray-800">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="rounded-md bg-green-600 px-4 py-2 text-white disabled:bg-green-400">
            {isSubmitting ? 'Depositing...' : 'Deposit'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMoneyModal;