import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import api from '../../libs/api';

// Schema for password change validation
const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
});

const ChangePassword = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(passwordSchema)
    });

    const onSubmit = async (data) => {
        try {
            // Corresponds to PUT /api-v1/users/change-password
            const response = await api.put('/users/change-password', data);
            toast.success(response.data.message);
            reset(); // Clear the form on success
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password.");
        }
    };

    return (
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-600">
            <h3 className="text-xl font-semibold">Change Password</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                For your security, please do not share your password with anyone.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 max-w-md">
                <div>
                    <label htmlFor="currentPassword">Current Password</label>
                    <input id="currentPassword" type="password" {...register("currentPassword")} className="mt-1 w-full rounded-md border p-2 dark:bg-gray-700"/>
                    {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>}
                </div>
                <div>
                    <label htmlFor="newPassword">New Password</label>
                    <input id="newPassword" type="password" {...register("newPassword")} className="mt-1 w-full rounded-md border p-2 dark:bg-gray-700"/>
                    {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input id="confirmPassword" type="password" {...register("confirmPassword")} className="mt-1 w-full rounded-md border p-2 dark:bg-gray-700"/>
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                </div>
                <div className="text-right">
                    <button type="submit" disabled={isSubmitting} className="rounded-md bg-indigo-600 px-4 py-2 text-white disabled:bg-indigo-400">
                        {isSubmitting ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;