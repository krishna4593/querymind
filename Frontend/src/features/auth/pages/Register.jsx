import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hook/useAuth'

const Register = () => {
  const navigate = useNavigate()
  const { handleRegister } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('idle')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setStatusMessage('')

    const result = await handleRegister(formData)

    if (!result?.success) {
      setStatusType('error')
      setStatusMessage(result?.message || 'Registration failed')
      setIsLoading(false)
      return
    }

    const mailSent = result?.data?.mailSent
    navigate('/verify-pending', {
      state: {
        email: formData.email,
        username: formData.username,
        mailSent: mailSent ?? true
      }
    })
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
        <div className="w-full rounded-2xl border border-[#31b8c6]/35 bg-zinc-950/90 p-8 shadow-[0_0_35px_rgba(49,184,198,0.15)]">
          <h1 className="text-3xl font-semibold tracking-tight text-[#31b8c6]">Create account</h1>
          <p className="mt-2 text-sm text-zinc-400">Make your new account.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {statusMessage && (
              <p
                className={`rounded-lg px-3 py-2 text-sm ${
                  statusType === 'error'
                    ? 'bg-red-500/10 text-red-300'
                    : statusType === 'warning'
                    ? 'bg-yellow-500/10 text-yellow-300'
                    : 'bg-emerald-500/10 text-emerald-300'
                }`}
              >
                {statusMessage}
              </p>
            )}
            <div>
              <label htmlFor="username" className="mb-2 block text-sm text-zinc-200">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-[#31b8c6] focus:ring-2 focus:ring-[#31b8c6]/35"
              />
            </div>

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
                placeholder="Create a password"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-[#31b8c6] focus:ring-2 focus:ring-[#31b8c6]/35"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#31b8c6] px-4 py-3 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-sm text-zinc-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[#31b8c6] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Register