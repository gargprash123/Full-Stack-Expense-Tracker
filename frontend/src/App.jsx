import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import SignUp from './pages/sign-up.pages'
import SignIn from './pages/sign-in.pages'
function App() {

  return (
    <main>
      <Routes>

        <Route path = "/sign-in" element = { <SignIn />} /> 
        <Route path = "/sign-up" element = { <SignUp />} /> 
      </Routes>
    </main>
  )
}

export default App
