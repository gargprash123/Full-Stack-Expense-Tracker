import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../libs/api';
import StatCard from '../components/dashboard/StatCard'; 
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import RecentAccounts from '../components/dashboard/RecentAccounts';
import useStore from '../store';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

const dataVersion = useStore(state => state.dataVersion);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/transactions/dashboard');
        setData(response.data);
      } catch (error) {
        toast.error("Could not load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [dataVersion]);

  if (isLoading) return <div className='text-white'>Loading...</div>;
  if (!data) return <div>Failed to load data.</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-300">Dashboard Overview</h1>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard title="Available Balance" amount={data.availableBalance} />
        <StatCard title="Total Income" amount={data.totalIncome} />
        <StatCard title="Total Expense" amount={data.totalExpense} />
      </div>
      {/* Chart and Accounts */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalyticsChart data={data.chartData} />
        </div>
        <div>
          <RecentAccounts accounts={data.lastAccount} />
        </div>
      </div>
      {/* Recent Transactions */}
      <div className="mt-8">
        <RecentTransactions transactions={data.lastTransactions} />
      </div>
    </div>
  );
};

export default Dashboard;