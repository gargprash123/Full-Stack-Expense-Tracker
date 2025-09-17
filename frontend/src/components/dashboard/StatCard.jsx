import React from 'react';

const StatCard = ({ title, amount, icon }) => {
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);

  return (
    <div className="overflow-hidden rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <div className="flex items-center">
        <div className="flex-shrink-0 rounded-md bg-gray-100 p-3 dark:bg-gray-700">
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">{title}</dt>
            <dd className="text-2xl font-bold text-gray-900 dark:text-white">{formattedAmount}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default StatCard;