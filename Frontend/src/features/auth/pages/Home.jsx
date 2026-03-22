import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Home = () => {
  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.auth.loading)

  if (loading) {
    return (
      <main className="grid min-h-screen place-content-center bg-black text-zinc-100">
        <p className="text-sm text-zinc-400">Loading...</p>
      </main>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <main className="relative h-screen overflow-hidden bg-[#050608] text-zinc-100">
      <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-cyan-500/25 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl animate-float-reverse" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(49,184,198,0.08),transparent_38%),radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.08),transparent_40%)]" />

      <section className="relative mx-auto flex h-full w-full max-w-5xl items-center justify-center px-6 py-4 sm:px-10">
        <div className="w-full max-h-full animate-rise-up text-center">
          <div className="mx-auto max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1 text-xs font-medium tracking-[0.18em] text-cyan-200 uppercase">
              Smart AI Chat Workspace
            </p>

            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
              QueryMind helps you turn ideas into structured answers.
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
              Draft content faster, ask better questions, and keep every conversation organized in one place.
              Get a focused AI dashboard designed for students, creators, and builders.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-[#31b8c6] px-6 py-3 text-sm font-semibold text-[#041114] transition hover:brightness-110"
              >
                Create New Account
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900/70 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-cyan-400/50 hover:text-cyan-100"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-3xl rounded-3xl border border-cyan-400/20 bg-zinc-950/70 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_40px_100px_rgba(6,182,212,0.15)] backdrop-blur">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3">
                <p className="text-xs tracking-[0.14em] text-zinc-500 uppercase">Context Memory</p>
                <p className="mt-2 text-sm text-zinc-300">
                  Continue any previous chat with full context and quick retrieval.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3">
                <p className="text-xs tracking-[0.14em] text-zinc-500 uppercase">Fast Responses</p>
                <p className="mt-2 text-sm text-zinc-300">
                  Ask technical, writing, or learning questions and get precise answers instantly.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3">
                <p className="text-xs tracking-[0.14em] text-zinc-500 uppercase">Focused Dashboard</p>
                <p className="mt-2 text-sm text-zinc-300">
                  Clean chat layout with search, history, and markdown-friendly AI output.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home