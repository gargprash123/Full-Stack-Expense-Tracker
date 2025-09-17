import React from 'react';
import { NavLink } from 'react-router-dom';
import { LuLayoutDashboard, LuArrowRightLeft, LuLandmark, LuSettings } from 'react-icons/lu';

const navLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: LuLayoutDashboard },
  { name: 'Accounts', path: '/accounts', icon: LuLandmark },
  { name: 'Transactions', path: '/transactions', icon: LuArrowRightLeft },
  { name: 'Settings', path: '/settings', icon: LuSettings },
];

const Sidebar = () => {
  return (
    <aside className="hidden w-64 flex-col border-r bg-white p-6 dark:border-gray-700 dark:bg-gray-800 md:flex">
      <div className="mb-10 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
        Expenses Tracker
      </div>
      <nav className="flex flex-col space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                isActive ? 'bg-indigo-50 font-semibold text-indigo-600 dark:bg-gray-700 dark:text-white' : ''
              }`
            }
          >
            <link.icon className="h-5 w-5" />
            {link.name}
          </NavLink>
        ))}
      </nav>
      <div>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <p className="text-center text-xs text-gray-400">
          Created & Developed by <br />
          <span className="font-semibold text-gray-500 dark:text-gray-300">Prashant Garg<br/> IIT BHU <br/> Electrical Engineering</span>
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;