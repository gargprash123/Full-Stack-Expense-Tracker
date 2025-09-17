import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import api from '../../libs/api';
import Modal from '../ui/Modal';

const schema = z.object({
  name: z.string().min(3, "Account name is required"),
  account_number: z.string().min(5, "Account number is required"),
  amount: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Initial amount must be positive")
  ),
});

const CreateAccountModal = ({ isOpen, onClose, onAccountCreated }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      // Corresponds to POST /api-v1/accounts/create
      await api.post('/accounts/create', data);
      toast.success("Account created successfully!");
      onAccountCreated(); // This will refetch the accounts list
      reset();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create account.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name">Account Name (e.g., Savings)</label>
          <input id="name" {...register("name")} className="w-full rounded-md border p-2 dark:bg-gray-700"/>
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="account_number">Account Number</label>
          <input id="account_number" {...register("account_number")} className="w-full rounded-md border p-2 dark:bg-gray-700"/>
          {errors.account_number && <p className="text-red-500 text-sm">{errors.account_number.message}</p>}
        </div>
        <div>
          <label htmlFor="amount">Initial Deposit Amount</label>
          <input id="amount" type="number" step="0.01" {...register("amount")} className="w-full rounded-md border p-2 dark:bg-gray-700"/>
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={onClose} className="rounded-md bg-gray-200 px-4 py-2 text-gray-800">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="rounded-md bg-indigo-600 px-4 py-2 text-white disabled:bg-indigo-400">
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateAccountModal;