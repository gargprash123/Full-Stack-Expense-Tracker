// This file is functionally identical to the previously provided sign-up.pages.jsx
// It simulates a successful signup and then navigates the user.
// (Content omitted for brevity but is the same as the prior example)
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FiUserPlus } from 'react-icons/fi';
import api from '../libs/api';

const signUpSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const SignUp = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(signUpSchema) });

  const onSubmit = async (data) => {
    try {
      // Corresponds to POST /api-v1/auth/sign-up
      await api.post('/auth/sign-up', data);
      toast.success('Account created successfully! Please sign in.');
      navigate('/sign-in');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Sign up failed.');
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
         <div className="text-center">
            <FiUserPlus className="mx-auto h-12 w-12 text-indigo-600" />
            <h2 className="mt-6 text-3xl font-bold">Create a new account</h2>
         </div>
         <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            {/* Form content from previous example */}
            <div>
              <label htmlFor="firstName">First Name</label>
              <input id="firstName" type="text" {...register("firstName")} />
              {errors.firstName && <p>{errors.firstName.message}</p>}
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" {...register("email")} />
              {errors.email && <p>{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input id="password" type="password" {...register("password")} />
              {errors.password && <p>{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
         </form>
         <p className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link to="/sign-in" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
      </div>
    </div>
  );
};
export default SignUp;