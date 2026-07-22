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

const RegisterPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const reduceMotion = useReducedMotion()
  const transition = { duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    houseNo: '',
    soi: '',
    road: '',
    subDistrict: '',
    district: '',
    province: '',
    postalCode: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }, [])

  const handleChange = (e) => {
    setError('')
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const checkPasswordStrength = (password) => {
    let score = 0
    if (password.length > 7) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    return score
  }

  const passwordScore = checkPasswordStrength(formData.password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.email || !formData.password || !formData.phone || 
        !formData.houseNo || !formData.subDistrict || !formData.district || 
        !formData.province || !formData.postalCode) {
      setError('Please fill in all required fields.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setLoading(true)
    try {
      const data = await authService.register(formData)
      if (data.success && data.user) {
        login(data.user)
        showToast('Account created successfully!')
        setTimeout(() => navigate('/'), 1500)
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to register. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full rounded-lg border border-[#EAEAEA] bg-[#F9F9F9] px-4 py-2.5 text-sm text-[#111111] outline-none transition-all focus:border-[#111111] focus:bg-white focus:ring-1 focus:ring-[#111111] hover:border-[#CCCCCC]"
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#666666]"

  return (
    <main className="min-h-screen bg-[#F9F9F9] px-6 py-16 selection:bg-[#111111] selection:text-white">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <motion.div
        className="mx-auto w-full max-w-2xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#EAEAEA] overflow-hidden"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
      >
        <div className="p-8 sm:p-12">
          <div className="mb-10 text-center">
            <Link to="/" className="inline-block text-2xl font-bold tracking-tighter text-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded mb-4">
              udee.
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight text-[#111111]">Create your account</h1>
            <p className="mt-2 text-sm text-[#666666]">Join us today to start shopping</p>
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

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Account Details */}
            <div className="space-y-5">
              <h2 className="text-sm font-semibold text-[#111111] border-b border-[#EAEAEA] pb-2">Account Details</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className={labelClass}>Full Name *</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Jane Doe" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>Phone *</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="08x-xxx-xxxx" className={inputClass} />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>Email Address *</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" placeholder="jane@example.com" className={inputClass} />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="password" className={labelClass}>Password *</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} required autoComplete="new-password" placeholder="••••••••" className={`${inputClass} pr-10`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#111111] focus-visible:outline-none">
                      <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2 flex gap-1 h-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div key={level} className={`flex-1 rounded-full transition-all ${level <= passwordScore ? (passwordScore < 2 ? 'bg-[#EF4444]' : passwordScore < 3 ? 'bg-[#F59E0B]' : 'bg-[#10B981]') : 'bg-[#EAEAEA]'}`} />
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>Confirm Password *</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required autoComplete="new-password" placeholder="••••••••" className={`${inputClass} pr-10`} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#111111] focus-visible:outline-none">
                      <span className="material-symbols-outlined text-[18px]">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="space-y-5">
              <h2 className="text-sm font-semibold text-[#111111] border-b border-[#EAEAEA] pb-2">Delivery Address</h2>
              
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label htmlFor="houseNo" className={labelClass}>House No / Building *</label>
                  <input type="text" id="houseNo" name="houseNo" value={formData.houseNo} onChange={handleChange} required placeholder="123/45 Building A" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="soi" className={labelClass}>Soi (Optional)</label>
                  <input type="text" id="soi" name="soi" value={formData.soi} onChange={handleChange} placeholder="Soi 1" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="road" className={labelClass}>Road (Optional)</label>
                  <input type="text" id="road" name="road" value={formData.road} onChange={handleChange} placeholder="Sukhumvit" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="subDistrict" className={labelClass}>Sub-district *</label>
                  <input type="text" id="subDistrict" name="subDistrict" value={formData.subDistrict} onChange={handleChange} required placeholder="Khlong Toei" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="district" className={labelClass}>District *</label>
                  <input type="text" id="district" name="district" value={formData.district} onChange={handleChange} required placeholder="Khlong Toei" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="province" className={labelClass}>Province *</label>
                  <input type="text" id="province" name="province" value={formData.province} onChange={handleChange} required placeholder="Bangkok" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="postalCode" className={labelClass}>Postal Code *</label>
                  <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value.replace(/\D/g, '').slice(0, 5) })} required placeholder="10110" maxLength={5} className={inputClass} />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#111111] px-4 py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#333333] hover:shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#111111] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-[#F9F9F9] border-t border-[#EAEAEA] p-6 text-center">
          <p className="text-sm text-[#666666]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#111111] hover:underline focus-visible:outline-none">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  )
}

export default RegisterPage
