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
        ? 'bg-white text-[#3D2B1F] border-[#EAEAEA]'
        : 'bg-[#FEF2F2] text-[#991B1B] border-[#FCA5A5]'
    }`}
  >
    <span className="material-symbols-outlined text-lg" style={{ color: type === 'success' ? '#10B981' : '#EF4444' }}>
      {type === 'success' ? 'check_circle' : 'error'}
    </span>
    <span className="flex-1">{message}</span>
    <button onClick={onClose} className="ml-2 text-[#888888] hover:text-[#3D2B1F] transition-colors focus-visible:outline-none">
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
      setError('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    setLoading(true)
    try {
      const data = await authService.login(formData)
      if (data.needsVerification || data.requiresVerification) {
        setNeedsVerification(true)
        showToast('กรุณาตรวจสอบอีเมลของคุณเพื่อรับรหัสยืนยัน')
      } else if (data.success && data.user) {
        login(data.token, data.user)
        showToast('ยินดีต้อนรับกลับมา!')
        setTimeout(() => navigate('/profile'), 1500)
      } else {
        setError(data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง')
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
      if (err.response?.status === 403 && msg.includes('verify')) {
        setNeedsVerification(true)
        showToast('บัญชียังไม่ได้รับการยืนยัน กรุณายืนยันอีเมล')
      } else {
        setError(msg === 'Invalid credentials' ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' : msg)
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
      setError('กรุณากรอกรหัส 6 หลัก')
      return
    }
    setError('')
    setVerifying(true)
    try {
      const data = await authService.verifyOtp(formData.email, code)
      if (data.success && data.user) {
        login(data.token, data.user)
        showToast('ยืนยันอีเมลสำเร็จ!')
        setTimeout(() => navigate('/profile'), 1500)
      } else {
        setError(data.error || 'การยืนยันล้มเหลว')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'การยืนยันล้มเหลว กรุณาลองใหม่อีกครั้ง')
    } finally {
      setVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    setResending(true)
    setError('')
    try {
      const data = await authService.resendOtp(formData.email)
      if (data.success) {
        showToast('ส่งรหัสใหม่ไปยังอีเมลของคุณแล้ว')
        setOtp(['', '', '', '', '', ''])
        document.getElementById('otp-0')?.focus()
      } else {
        setError(data.error || 'ไม่สามารถส่งรหัสใหม่ได้')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'ไม่สามารถส่งรหัสใหม่ได้ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setResending(false)
    }
  }

  const inputClass = "w-full rounded-lg border border-[#EAEAEA] bg-[#F9F9F9] px-4 py-3 text-sm text-[#3D2B1F] outline-none transition-all focus:border-[#A0724A] focus:bg-white focus:ring-1 focus:ring-[#A0724A] hover:border-[#CCCCCC]"
  const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-wider text-[#5a4e46]"

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAF6F1] px-6 py-20 selection:bg-[#A0724A] selection:text-white" style={{ fontFamily: 'Kanit, Inter, Prompt, Mitr, sans-serif' }}>
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
            <div className="flex justify-center mb-6">
              <Link to="/" className="flex items-center gap-1 cursor-pointer shrink-0 group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A0724A] rounded-xl p-1">
                <div className="relative w-12 h-12 bg-[#A0724A] rounded-xl flex items-center justify-center shadow-lg shadow-[#A0724A]/30 overflow-hidden transition-all duration-700 group-hover:scale-110 group-hover:rotate-[10deg] group-hover:shadow-[#A0724A]/50">
                  <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative text-white font-bold text-2xl italic leading-none transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-[10deg]">
                    U
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-2xl font-black tracking-tighter text-[#3D2B1F] uppercase transition-all duration-500 group-hover:tracking-widest group-hover:translate-x-1">
                    dee
                  </span>
                  <div className="h-[2px] w-0 bg-[#A0724A] transition-all duration-500 group-hover:w-full rounded-full" />
                </div>
              </Link>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#3D2B1F]">
              {needsVerification ? 'ยืนยันอีเมลของคุณ' : 'เข้าสู่ระบบบัญชีของคุณ'}
            </h1>
            <p className="mt-2 text-sm text-[#5a4e46]">
              {needsVerification 
                ? `เราได้ส่งรหัส 6 หลักไปยัง ${formData.email}`
                : 'ยินดีต้อนรับกลับมา! กรุณากรอกข้อมูลของคุณ'}
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
                <label htmlFor="email" className={labelClass}>ที่อยู่อีเมล</label>
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
                  <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-[#5a4e46]">รหัสผ่าน</label>
                  <a href="#" className="text-xs font-medium text-[#3D2B1F] hover:text-[#A0724A] hover:underline focus-visible:outline-none">ลืมรหัสผ่าน?</a>
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#3D2B1F] transition-colors focus-visible:outline-none focus-visible:text-[#3D2B1F]"
                    aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
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
                  className="w-full rounded-lg bg-[#3D2B1F] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#5a4e46] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3D2B1F] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      กำลังเข้าสู่ระบบ...
                    </>
                  ) : (
                    'เข้าสู่ระบบ'
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
                    className="h-12 w-12 text-center text-lg font-bold rounded-lg border border-[#EAEAEA] bg-[#F9F9F9] text-[#3D2B1F] outline-none transition-all focus:border-[#A0724A] focus:bg-white focus:ring-1 focus:ring-[#A0724A]"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={verifying}
                className="w-full rounded-lg bg-[#3D2B1F] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#5a4e46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3D2B1F] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {verifying ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    กำลังยืนยัน...
                  </>
                ) : (
                  'ยืนยันอีเมล'
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="text-xs font-medium text-[#5a4e46] hover:text-[#3D2B1F] underline focus-visible:outline-none disabled:opacity-50"
                >
                  {resending ? 'กำลังส่งรหัสใหม่...' : "ไม่ได้รับรหัส? ส่งอีกครั้ง"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="bg-[#F9F9F9] border-t border-[#EAEAEA] p-6 text-center">
          <p className="text-sm text-[#5a4e46]">
            ยังไม่มีบัญชี?{' '}
            <Link to="/register" className="font-semibold text-[#3D2B1F] hover:text-[#A0724A] hover:underline focus-visible:outline-none">
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  )
}

export default LoginPage
