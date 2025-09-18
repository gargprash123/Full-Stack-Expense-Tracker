import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import useStore from './store';

// Import Pages
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import AccountPage from './pages/AccountPage';
import Transactions from './pages/Transactions';

// Import Layout Components
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';

const RootLayout = () => {
  const { user } = useStore();

  if (!user) {
    return <Navigate to="/sign-in" replace={true} />;
  }

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-slate-700">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/accounts" element={<AccountPage />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Public Routes */}
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  );
}

export default App;