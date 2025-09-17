import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import SignUp from './pages/sign-up.pages'
import SignIn from './pages/sign-in.pages'
import Dashboard from './pages/dashboard.pages'
import Settings from './pages/settings.pages'
import AccountPage from './pages/account-page.pages'
import Transactions from './pages/transactions.pages'
import  useStore  from './store/index'

const RootLayout = () => {
  const user = useStore((state) => state.user);
  // console.log(user);
  return !user ? (
  <Navigate to="sign-in" replace = {true} />) : (
  <>
    {/* <Navbar /> */}
    <div>
      <Outlet className='min-h-[cal(h-screen-100px)]'/>
    </div>
  </>
  );
};
function App() {

  return (
    <main>
      <div className='w-full min-h-screen px-6 bg-grey-100 md:px-20 dark:bg-slate-900'>
        <Routes>
        <Route element={ <RootLayout/> }>
          <Route path = "/" element={<Navigate to="/overview" />}/>
          <Route path = "/overview" element={<Dashboard />}/>
          <Route path = "/transactions" element={<Transactions />}/>
          <Route path = "/settings" element={<Settings />}/>
          <Route path = "/account" element={<AccountPage />}/>

        </Route>

        <Route path = "/sign-in" element = { <SignIn />} /> 
        <Route path = "/sign-up" element = { <SignUp />} /> 
      </Routes>
      </div>
      
    </main>
  )
}

export default App
