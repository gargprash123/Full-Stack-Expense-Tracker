import React from 'react';
import { FaUniversity } from 'react-icons/fa';

const RecentAccounts = ({ accounts }) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Accounts</h3>
      <div className="mt-4 flow-root">
        <ul role="list" className="-my-4 divide-y divide-gray-200 dark:divide-gray-700">
          {accounts?.map((account) => (
            <li key={account.id} className="flex items-center space-x-4 py-4">
              <div className="flex-shrink-0">
                <FaUniversity className="h-8 w-8 text-gray-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900 dark:text-white">{account.account_name}</p>
                <p className="truncate text-sm text-gray-500 dark:text-gray-400">{account.account_number}</p>
              </div>
              <div className="text-right font-medium text-gray-900 dark:text-white">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(account.account_balance)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentAccounts;