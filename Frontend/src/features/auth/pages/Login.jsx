import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hook/useAuth'

const Login = () => {
  const navigate = useNavigate()  
  const {handleLogin} = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    handleLogin(formData)
    navigate('/')
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
        <div className="w-full rounded-2xl border border-[#31b8c6]/35 bg-zinc-950/90 p-8 shadow-[0_0_35px_rgba(49,184,198,0.15)]">
          <h1 className="text-3xl font-semibold tracking-tight text-[#31b8c6]">Login</h1>
          <p className="mt-2 text-sm text-zinc-400">Sign in to your account.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-zinc-200">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-[#31b8c6] focus:ring-2 focus:ring-[#31b8c6]/35"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm text-zinc-200">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-[#31b8c6] focus:ring-2 focus:ring-[#31b8c6]/35"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#31b8c6] px-4 py-3 text-sm font-semibold text-black transition hover:brightness-110"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-sm text-zinc-400">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-[#31b8c6] hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login