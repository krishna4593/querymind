import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../hook/useAuth'

const VerifyPending = () => {
  const location = useLocation()
  const { handleResendVerification } = useAuth()
  
  const { email } = location.state || {}
  const [countdown, setCountdown] = useState(0)
  const [resendMessage, setResendMessage] = useState('')
  const [resendStatus, setResendStatus] = useState('idle')
  const [isResending, setIsResending] = useState(false)

  // Handle countdown timer
  useEffect(() => {
    if (countdown <= 0) return
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [countdown])

  const handleResendEmail = async () => {
    if (!email) return
    
    setIsResending(true)
    setResendStatus('idle')
    setResendMessage('')

    try {
      const result = await handleResendVerification(email)
      
      if (result?.success) {
        setResendStatus('success')
        setResendMessage('Verification email sent! Check your inbox.')
        setCountdown(60)
      } else {
        setResendStatus('error')
        setResendMessage(result?.message || 'Failed to resend email. Try again.')
      }
    } catch {
      setResendStatus('error')
      setResendMessage('Error sending email. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  const openEmailInbox = () => {
    window.open('https://mail.google.com', '_blank')
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6">
        <div className="w-full rounded-2xl border border-[#31b8c6]/35 bg-zinc-950/90 p-8 shadow-[0_0_35px_rgba(49,184,198,0.15)]">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <div className="rounded-full bg-[#31b8c6]/10 p-4">
              <span className="text-4xl">📧</span>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-[#31b8c6]">
                Verify Your Email
              </h1>
              <p className="mt-2 text-sm text-zinc-400">
                We've sent a verification link to your email
              </p>
            </div>
          </div>

          {/* Email Display */}
          {email && (
            <div className="mb-8 rounded-lg border border-zinc-700/50 bg-zinc-900/50 px-4 py-3">
              <p className="text-sm text-zinc-400">Email address:</p>
              <p className="font-medium text-[#31b8c6]">{email}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="mb-8 space-y-3">
            <p className="text-sm text-zinc-300">
              📧 Check your email inbox for a verification link
            </p>
            <p className="text-sm text-zinc-400">
              💡 <span className="text-zinc-300">Tip:</span> If you don't see the email, check your spam or promotions folder
            </p>
          </div>

          {/* Status Messages */}
          {resendMessage && (
            <div
              className={`mb-6 rounded-lg px-4 py-3 text-sm ${
                resendStatus === 'error'
                  ? 'border border-red-500/30 bg-red-500/10 text-red-300'
                  : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              }`}
            >
              {resendMessage}
            </div>
          )}

          {/* Open Email Button */}
          <button
            onClick={openEmailInbox}
            className="mb-4 w-full rounded-lg bg-[#31b8c6] px-4 py-3 font-medium text-black transition hover:bg-[#31b8c6]/90 active:scale-95"
          >
            📧 Open Email Inbox
          </button>

          {/* Resend Email Button */}
          <button
            onClick={handleResendEmail}
            disabled={countdown > 0 || isResending}
            className={`w-full rounded-lg px-4 py-3 font-medium transition ${
              countdown > 0 || isResending
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'border border-[#31b8c6]/30 bg-zinc-900 text-[#31b8c6] hover:bg-zinc-800 active:scale-95'
            }`}
          >
            {countdown > 0 ? (
              <span className="flex items-center justify-center gap-2">
                ⏱️ Resend in {countdown}s
              </span>
            ) : isResending ? (
              'Sending...'
            ) : (
              'Resend Verification Email'
            )}
          </button>

          {/* Additional Info */}
          <p className="mt-6 text-center text-xs text-zinc-500">
            After verifying your email, you can log in to your account
          </p>
        </div>
      </section>
    </main>
  )
}

export default VerifyPending
