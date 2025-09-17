// This file is functionally identical to the previously provided sign-in.pages.jsx
// It uses the setCredentials action from the store upon successful login.
// (Content omitted for brevity but is the same as the prior example)
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FiLogIn } from 'react-icons/fi';
import useStore from '../store';
import api from '../libs/api';

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const SignIn = () => {
  const navigate = useNavigate();
  const setCredentials = useStore((state) => state.setCredentials);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(signInSchema) });

  const onSubmit = async (data) => {
    try {
      // Corresponds to POST /api-v1/auth/sign-in
      const response = await api.post('/auth/sign-in', data);
      setCredentials(response.data);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Sign in failed.');
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
          <div className="text-center">
            <FiLogIn className="mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-400" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
             {/* Form content from previous example */}
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
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm">
            Don't have an account?{' '}
            <Link to="/sign-up" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </Link>
          </p>
      </div>
    </div>
  );
};
export default SignIn;