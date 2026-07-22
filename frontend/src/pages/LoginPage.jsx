import { useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts'
import * as authService from '../services/auth'

// ─── Toast ─────────────────────────────────────────────────────────────────────

const Toast = ({ message, type = 'success', onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.9 }}
    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    className={`fixed top-6 right-6 z-[100] flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg text-sm font-medium max-w-sm border ${
      type === 'success'
        ? 'bg-white text-[#111111] border-[#EAEAEA]'
        : 'bg-[#FEF2F2] text-[#991B1B] border-[#FCA5A5]'
    }`}
  >
    <span className="material-symbols-outlined text-lg" style={{ color: type === 'success' ? '#10B981' : '#EF4444' }}>
      {type === 'success' ? 'check_circle' : 'error'}
    </span>
    <span className="flex-1">{message}</span>
    <button onClick={onClose} className="ml-2 text-[#888888] hover:text-[#111111] transition-colors focus-visible:outline-none">
      <span className="material-symbols-outlined text-base">close</span>
    </button>
  </motion.div>
)

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const reduceMotion = useReducedMotion()
  const transition = { duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  const [needsVerification, setNeedsVerification] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }, [])

  const handleChange = (e) => {
    setError('')
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const data = await authService.login(formData)
      if (data.requiresVerification) {
        setNeedsVerification(true)
        showToast('Please check your email for the verification code')
      } else if (data.success && data.user) {
        login(data.user)
        showToast('Welcome back!')
        setTimeout(() => navigate('/profile'), 1500)
      } else {
        setError(data.message || 'Invalid credentials')
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to sign in. Please try again.'
      if (err.response?.status === 403 && msg.includes('verify')) {
        setNeedsVerification(true)
        showToast('Account not verified. Please verify your email.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length !== 6) {
      setError('Please enter a 6-digit code')
      return
    }
    setError('')
    setVerifying(true)
    try {
      const data = await authService.verifyEmail(formData.email, code)
      if (data.success && data.user) {
        login(data.user)
        showToast('Email verified successfully!')
        setTimeout(() => navigate('/profile'), 1500)
      } else {
        setError(data.error || 'Verification failed')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Please try again.')
    } finally {
      setVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    setResending(true)
    setError('')
    try {
      const data = await authService.resendVerification(formData.email)
      if (data.success) {
        showToast('A new code has been sent to your email')
        setOtp(['', '', '', '', '', ''])
        document.getElementById('otp-0')?.focus()
      } else {
        setError(data.error || 'Failed to resend code')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend code. Please try again.')
    } finally {
      setResending(false)
    }
  }

  const inputClass = "w-full rounded-lg border border-[#EAEAEA] bg-[#F9F9F9] px-4 py-3 text-sm text-[#111111] outline-none transition-all focus:border-[#111111] focus:bg-white focus:ring-1 focus:ring-[#111111] hover:border-[#CCCCCC]"
  const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-wider text-[#666666]"

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F9F9F9] px-6 py-20 selection:bg-[#111111] selection:text-white">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#EAEAEA] overflow-hidden"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
      >
        <div className="p-8 sm:p-10">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-block text-2xl font-bold tracking-tighter text-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded mb-6">
              udee.
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight text-[#111111]">
              {needsVerification ? 'Verify your email' : 'Sign in to your account'}
            </h1>
            <p className="mt-2 text-sm text-[#666666]">
              {needsVerification 
                ? `We sent a 6-digit code to ${formData.email}`
                : 'Welcome back! Please enter your details.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] px-4 py-3 text-sm text-[#991B1B]">
                  <span className="material-symbols-outlined text-base">error</span>
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!needsVerification ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className={labelClass}>Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="name@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-[#666666]">Password</label>
                  <a href="#" className="text-xs font-medium text-[#111111] hover:underline focus-visible:outline-none">Forgot password?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#111111] transition-colors focus-visible:outline-none focus-visible:text-[#111111]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#111111] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#333333] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#111111] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="h-12 w-12 text-center text-lg font-bold rounded-lg border border-[#EAEAEA] bg-[#F9F9F9] text-[#111111] outline-none transition-all focus:border-[#111111] focus:bg-white focus:ring-1 focus:ring-[#111111]"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={verifying}
                className="w-full rounded-lg bg-[#111111] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#111111] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {verifying ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="text-xs font-medium text-[#666666] hover:text-[#111111] underline focus-visible:outline-none disabled:opacity-50"
                >
                  {resending ? 'Sending new code...' : "Didn't receive a code? Resend"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="bg-[#F9F9F9] border-t border-[#EAEAEA] p-6 text-center">
          <p className="text-sm text-[#666666]">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#111111] hover:underline focus-visible:outline-none">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  )
}

export default LoginPage
