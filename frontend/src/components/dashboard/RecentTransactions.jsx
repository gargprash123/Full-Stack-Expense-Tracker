import React from 'react';

const RecentTransactions = ({ transactions }) => {
  const getStatusColor = (status) => {
    return status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
        <div className="mt-4 flow-root">
          <div className="-mx-6 -my-2 overflow-x-auto">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <tbody>
                  {transactions?.map((tx) => (
                    <tr key={tx.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                        <div className="flex items-center">
                          <div className={`h-2.5 w-2.5 rounded-full ${tx.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`} />
                          <div className="ml-4">
                            <div className="font-medium text-gray-900 dark:text-white">{tx.description}</div>
                            <div className="mt-1 text-gray-500 dark:text-gray-400">{tx.source}</div>
                            <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
    {new Date(tx.createdat).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
  </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                        {tx.type === 'income' ? '+' : '-'}
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;