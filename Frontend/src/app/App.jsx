import React from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './auth.routes'
import { useAuth } from '../features/auth/hook/useAuth'
import { useEffect } from 'react'

const App = () => {
  const auth = useAuth()

  useEffect(() => {
    auth.fetchMe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <RouterProvider router={router} />
  )
}

export default App