import React from 'react';
import useStore from '../../store';
import { useNavigate } from 'react-router-dom';
import { LuLogOut } from 'react-icons/lu';

const Navbar = () => {
  const { user, signOut } = useStore();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/sign-in');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="text-lg font-semibold text-gray-800 dark:text-white">
        Welcome, {user?.user?.firstname || user?.name || 'User'}!
      </div>
      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <LuLogOut />
        <span>Sign Out</span>
      </button>
    </header>
  );
};

export default Navbar;