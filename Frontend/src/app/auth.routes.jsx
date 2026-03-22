import {createBrowserRouter} from 'react-router-dom'
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import VerifyPending from '../features/auth/pages/VerifyPending'
import Dashboard from '../features/chat/pages/Dashboard'
import Protected from '../features/auth/Components/Protected'
import Home from '../features/auth/pages/Home'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/verify-pending',
    element: <VerifyPending />
  },
  {
    path: '/dashboard',
    element: <Protected><Dashboard /></Protected>
  }
])

export default router