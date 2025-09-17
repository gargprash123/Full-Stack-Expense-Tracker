import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import api from '../../libs/api';
import useStore from '../../store';

// Schema for profile update validation
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastname: z.string().optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
  contact: z.string().optional(),
});

const ProfileSettings = () => {
  const { user, setCredentials } = useStore();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(profileSchema),
  });

  // Fetch user data when the component mounts to pre-fill the form
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Corresponds to GET /api-v1/users/
        const response = await api.get('/users');
        // Pre-fill the form with existing user data
        reset(response.data.user);
      } catch (error) {
        toast.error('Could not fetch user profile.');
      }
    };
    fetchUserData();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      // Corresponds to PUT /api-v1/users/:id
      const response = await api.put(`/users/${user.user.id}`, data);
      
      // Update the user state in Zustand with the new information
      setCredentials({ ...user, user: response.data.user });

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-600">
      <h3 className="text-xl font-semibold">Personal Information</h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Update your personal details here.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" {...register("firstName")} className="mt-1 w-full rounded-md border p-2 dark:bg-gray-700"/>
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
        </div>
        <div>
          <label htmlFor="lastname">Last Name</label>
          <input id="lastname" {...register("lastname")} className="mt-1 w-full rounded-md border p-2 dark:bg-gray-700"/>
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <input id="country" {...register("country")} className="mt-1 w-full rounded-md border p-2 dark:bg-gray-700"/>
        </div>
        <div>
          <label htmlFor="currency">Currency</label>
          <input id="currency" {...register("currency")} className="mt-1 w-full rounded-md border p-2 dark:bg-gray-700"/>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact">Contact</label>
          <input id="contact" {...register("contact")} className="mt-1 w-full rounded-md border p-2 dark:bg-gray-700"/>
        </div>
        <div className="sm:col-span-2 text-right">
          <button type="submit" disabled={isSubmitting} className="rounded-md bg-indigo-600 px-4 py-2 text-white disabled:bg-indigo-400">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;