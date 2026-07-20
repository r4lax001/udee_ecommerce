import { useMemo, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion, useAnimation } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { authPageData } from '../data/authPageData'
import { useAuth } from '../contexts'
import * as authService from '../services/auth'

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
const isValidThaiPhone = (phone) => /^0[0-9]{9}$/.test(phone.trim())
const isValidPostalCode = (code) => /^\d{5}$/.test(code.trim())

const getStrength = (value) => {
  let score = 0
  if (value.length >= 8) score++
  if (value.length > 12) score++
  if (/[A-Z]/.test(value)) score++
  if (/[0-9]/.test(value)) score++
  return score
}

const getStrengthText = (score) => {
  if (score === 0) return { text: 'กรุณาใส่รหัสผ่าน', color: 'text-[#BA1A1A]' }
  if (score <= 2) return { text: 'รหัสผ่านค่อนข้างอ่อน', color: 'text-[#BA1A1A]' }
  if (score === 3) return { text: 'รหัสผ่านปลอดภัยปานกลาง', color: 'text-[#7F5530]' }
  return { text: 'รหัสผ่านปลอดภัยมาก', color: 'text-[#3D2B1F]' }
}

const Toast = ({ message, type = 'success', onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.9 }}
    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-6 py-4 shadow-2xl text-sm font-medium max-w-sm backdrop-blur-xl ${
      type === 'success' 
        ? 'bg-gradient-to-r from-[#3D2B1F] to-[#5D4B3F] text-white border border-[#FFC698]/30' 
        : 'bg-gradient-to-r from-[#FFDBD6] to-[#FFE5E0] text-[#7F1A18] border border-[#BA1A1A]/30'
    }`}
  >
    <motion.span 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
      className="material-symbols-outlined text-lg"
    >
      {type === 'success' ? 'check_circle' : 'error'}
    </motion.span>
    <span className="flex-1">{message}</span>
    <motion.button 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClose} 
      className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
    >
      <span className="material-symbols-outlined text-base">close</span>
    </motion.button>
  </motion.div>
)

const FloatingElement = ({ delay, duration, size, color, top, left }) => {
    const controls = useAnimation()
    
    useEffect(() => {
      controls.start({
        y: [0, -20, 0],
        x: [0, 10, 0],
        rotate: [0, 5, 0],
        transition: {
          duration,
          repeat: Infinity,
          delay,
          ease: 'easeInOut'
        }
      })
    }, [controls, delay, duration])
    
    return (
      <motion.div
        animate={controls}
        className={`absolute rounded-full blur-2xl opacity-30`}
        style={{
          width: size,
          height: size,
          background: color,
          top,
          left
        }}
      />
    )
  }

const Particle = ({ x, y, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0],
        y: [0, -100, -200]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: 'easeOut'
      }}
      className="absolute w-2 h-2 rounded-full bg-[#FFC698]/40"
      style={{ left: x, top: y }}
    />
  )
}

const RegisterPage = ({ authData = authPageData }) => {
  const reduceMotion = useReducedMotion()
  const navigate = useNavigate()
  const transition = { duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }
  const { login } = useAuth()
  const [focusedInput, setFocusedInput] = useState(null)

  const [registerName, setRegisterName] = useState('')
  const [registerPhone, setRegisterPhone] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [otpEmail, setOtpEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpResendCooldown, setOtpResendCooldown] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [toast, setToast] = useState(null)
  const [showOtp, setShowOtp] = useState(false)
  
  // Address fields
  const [houseNo, setHouseNo] = useState('')
  const [soi, setSoi] = useState('')
  const [road, setRoad] = useState('')
  const [subDistrict, setSubDistrict] = useState('')
  const [district, setDistrict] = useState('')
  const [province, setProvince] = useState('')
  const [postalCode, setPostalCode] = useState('')

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }, [])

  useEffect(() => {
    if (otpResendCooldown <= 0) return
    const timer = setTimeout(() => setOtpResendCooldown((prev) => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [otpResendCooldown])

  const passwordStrength = useMemo(() => getStrength(registerPassword), [registerPassword])
  const strengthText = getStrengthText(passwordStrength)

  const handleRegisterSubmit = async () => {
    if (!registerName.trim() || !registerPhone.trim() || !registerEmail.trim() || !registerPassword.trim() || !confirmPassword.trim()) {
      setErrorMessage('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน')
      return
    }
    if (!isValidEmail(registerEmail)) {
      setErrorMessage('รูปแบบอีเมลไม่ถูกต้อง')
      return
    }
    if (!isValidThaiPhone(registerPhone)) {
      setErrorMessage('รูปแบบเบอร์โทรไม่ถูกต้อง (กรุณากรอก 10 หลัก เช่น 0812345678)')
      return
    }
    if (registerPassword.length < 8) {
      setErrorMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร')
      return
    }
    if (!/[A-Z]/.test(registerPassword)) {
      setErrorMessage('รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว')
      return
    }
    if (!/[0-9]/.test(registerPassword)) {
      setErrorMessage('รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว')
      return
    }
    if (registerPassword !== confirmPassword) {
      setErrorMessage('รหัสผ่านและยืนยันรหัสผ่านต้องตรงกัน')
      return
    }
    // Address validation
    if (!houseNo.trim() || !subDistrict.trim() || !district.trim() || !province.trim() || !postalCode.trim()) {
      setErrorMessage('กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน')
      return
    }
    if (!isValidPostalCode(postalCode)) {
      setErrorMessage('รูปแบบรหัสไปรษณีย์ไม่ถูกต้อง (กรุณากรอก 5 หลัก)')
      return
    }
    if (!agreeTerms) {
      setErrorMessage('กรุณายอมรับเงื่อนไขการให้บริการและนโยบายความเป็นส่วนตัว')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const addressData = {
        houseNo: houseNo.trim(),
        soi: soi.trim(),
        road: road.trim(),
        subDistrict: subDistrict.trim(),
        district: district.trim(),
        province: province.trim(),
        postalCode: postalCode.trim()
      }
      const data = await authService.register(registerName.trim(), registerEmail.trim(), registerPassword, registerPhone.trim(), addressData)
      if (data.success) {
        setOtpEmail(registerEmail.trim())
        setOtpCode('')
        setOtpResendCooldown(60)
        setShowOtp(true)
        showToast('สมัครสมาชิกสำเร็จ! รหัส OTP ถูกส่งไปที่อีเมลของคุณแล้ว')
      } else {
        setErrorMessage(data.message || 'การสมัครสมาชิกไม่สำเร็จ')
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpSubmit = async () => {
    if (!/^\d{6}$/.test(otpCode)) {
      setErrorMessage('กรุณากรอกรหัส OTP ให้ครบ 6 หลัก')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const data = await authService.verifyOtp(otpEmail, otpCode)
      if (data.success) {
        login(data.token, data.user)
        showToast('ยืนยันตัวตนสำเร็จ! ยินดีต้อนรับสู่ UDEE Furniture')
        setTimeout(() => {
          navigate(data.user.role === 'ADMIN' ? '/admin-dashboard' : '/')
        }, 800)
      } else {
        setErrorMessage(data.message || 'รหัส OTP ไม่ถูกต้อง')
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'เกิดข้อผิดพลาดในการยืนยันตัวตน กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOtp = async () => {
    if (otpResendCooldown > 0) return
    try {
      const data = await authService.resendOtp(otpEmail)
      if (data.success) {
        setOtpResendCooldown(60)
        setOtpCode('')
        showToast('ส่งรหัส OTP ใหม่เรียบร้อยแล้ว กรุณาตรวจสอบอีเมลของคุณ')
      } else {
        setErrorMessage(data.message || 'ไม่สามารถส่งรหัส OTP ได้')
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'เกิดข้อผิดพลาดในการส่งรหัส OTP')
    }
  }

  return (
    <motion.main
      className="h-[1200px] bg-gradient-to-br from-[#FAF6F1] via-[#F5EBE3] to-[#EDE4DB] text-[#1D1B1A] flex items-center justify-center relative overflow-hidden"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition}
    >
      {!reduceMotion && (
        <>
          {[...Array(15)].map((_, i) => (
            <Particle key={i} x={`${Math.random() * 100}%`} y={`${Math.random() * 100}%`} delay={Math.random() * 3} />
          ))}
        </>
      )}

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <motion.div
        className="w-full max-w-[1100px] min-h-[650px] flex flex-col overflow-hidden bg-white/90 backdrop-blur-xl md:flex-row md:rounded-[2.5rem] shadow-2xl shadow-[#3D2B1F]/15 border border-white/60"
        initial={reduceMotion ? false : { scale: 0.92, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      >
        <motion.section className="relative flex w-full flex-col justify-between bg-gradient-to-br from-[#3D2B1F] via-[#4A3828] to-[#2D1F15] px-8 py-10 text-[#F3ECEA] md:w-[38%] md:px-12 md:py-14 overflow-hidden">
          {!reduceMotion && (
            <>
              <FloatingElement delay={0} duration={6} size="280px" color="#FFC698" top="-8%" right="-8%" />
              <FloatingElement delay={1} duration={8} size="220px" color="#3F2B0F" top="35%" left="-8%" />
              <FloatingElement delay={2} duration={7} size="180px" color="#A0724A" bottom="-8%" right="15%" />
            </>
          )}
          
          <div className="relative z-10">
            <motion.h1 
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.45 }}
              className="mb-3 text-5xl font-bold md:text-6xl font-prompt bg-gradient-to-r from-[#FFC698] to-[#FFF1E7] bg-clip-text text-transparent"
            >
              {authData.brand}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.45 }}
              className="mb-10 text-xl md:text-2xl font-medium leading-tight text-[#FFF1E7] font-kanit"
            >
              {authData.title}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.45 }}
              className="space-y-5"
            >
              {authData.features.map((feature, index) => (
                <motion.div 
                  key={feature} 
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + index * 0.08, duration: 0.45 }}
                  className="flex items-center gap-3 text-sm md:text-base group cursor-default"
                >
                  <motion.span 
                    whileHover={{ scale: 1.15, rotate: 8 }}
                    className="material-symbols-outlined text-[#FFC698] text-xl" 
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </motion.span>
                  <span className="group-hover:text-[#FFC698] transition-colors">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.45 }}
            className="relative z-10 mt-auto rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-5 shadow-xl"
          >
            <p className="text-xs italic text-[#F3ECEA]/90 font-mitr leading-relaxed">{authData.testimonial}</p>
          </motion.div>
        </motion.section>

        <motion.section className="flex w-full flex-col bg-gradient-to-br from-[#FAF6F1]/60 to-white px-6 py-8 md:w-[62%] md:px-12 md:py-12 relative">
          <div className="md:hidden mb-6">
            <h2 className="text-3xl font-bold text-[#3D2B1F] font-prompt">{authData.brand}</h2>
          </div>

          <AnimatePresence>
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                className="mb-5 flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#FFDBD6] to-[#FFE5E0] px-4 py-3 text-sm text-[#7F1A18] border border-[#BA1A1A]/20 shadow-lg"
              >
                <motion.span 
                  animate={{ rotate: [0, -8, 8, -8, 0] }}
                  transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 2 }}
                  className="material-symbols-outlined text-lg"
                >
                  error
                </motion.span>
                <span className="flex-1 font-medium">{errorMessage}</span>
                <button onClick={() => setErrorMessage('')} className="opacity-60 hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {showOtp ? (
              <motion.div 
                key="otp"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div>
                  <motion.h3 
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl md:text-2xl font-bold text-[#3D2B1F] mb-2 font-prompt"
                  >
                    ยืนยันที่อยู่อีเมลของคุณ
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 }}
                    className="text-sm text-[#81756E] mb-6"
                  >
                    ระบบได้ส่งรหัส OTP 6 หลักไปที่ <span className="font-semibold text-[#3D2B1F]">{otpEmail}</span> กรุณากรอกรหัสดังกล่าวเพื่อยืนยันความเป็นเจ้าของบัญชี
                  </motion.p>
                  <label className="mb-3 block text-sm font-semibold text-[#4F453F]">รหัสยืนยัน OTP (6 หลัก)</label>
                  <div className="flex gap-2 justify-center">
                    {[...Array(6)].map((_, index) => (
                      <motion.input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={otpCode[index] || ''}
                        onChange={(e) => {
                          const newCode = otpCode.split('')
                          newCode[index] = e.target.value
                          setOtpCode(newCode.join(''))
                          if (e.target.value && index < 5) {
                            e.target.nextElementSibling?.focus()
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
                            e.target.previousElementSibling?.focus()
                          }
                        }}
                        className={`w-10 h-12 md:w-12 md:h-14 text-center text-xl md:text-2xl font-bold rounded-lg border-2 bg-white text-[#1D1B1A] outline-none transition-all duration-200 ${
                          focusedInput === `otp-${index}` 
                            ? 'border-[#A0724A] ring-3 ring-[#A0724A]/20 shadow-lg shadow-[#A0724A]/30' 
                            : 'border-[#D2C4BC] hover:border-[#A0724A]/50'
                        }`}
                        onFocus={() => setFocusedInput(`otp-${index}`)}
                        onBlur={() => setFocusedInput(null)}
                        whileFocus={{ scale: 1.03 }}
                      />
                    ))}
                  </div>
                </div>
                <motion.button 
                  type="button" 
                  disabled={otpCode.length !== 6 || isSubmitting} 
                  onClick={handleOtpSubmit} 
                  whileHover={{ scale: 1.01, boxShadow: '0 8px 30px -8px rgba(61, 43, 31, 0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full rounded-xl bg-gradient-to-r from-[#3D2B1F] to-[#5D4B3F] py-3.5 text-sm md:text-base font-semibold text-white shadow-lg transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="material-symbols-outlined">refresh</motion.span>
                      กำลังยืนยัน...
                    </span>
                  ) : (
                    'ยืนยันรหัส OTP'
                  )}
                </motion.button>
                <div className="flex flex-col items-center gap-3 mt-6">
                  <motion.button 
                    type="button" 
                    onClick={handleResendOtp} 
                    disabled={otpResendCooldown > 0} 
                    whileHover={{ scale: otpResendCooldown === 0 ? 1.03 : 1 }}
                    whileTap={{ scale: otpResendCooldown === 0 ? 0.97 : 1 }}
                    className={`text-sm font-semibold transition-all duration-300 ${
                      otpResendCooldown > 0 
                        ? 'text-[#81756E] cursor-not-allowed' 
                        : 'text-[#7F5530] hover:text-[#A0724A] hover:underline'
                    }`}
                  >
                    {otpResendCooldown > 0 ? `ส่งรหัสใหม่ได้ใน ${otpResendCooldown} วินาที` : 'ส่งรหัส OTP อีกครั้ง'}
                  </motion.button>
                  <motion.button 
                    type="button" 
                    onClick={() => { setShowOtp(false); setErrorMessage('') }} 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="text-sm text-[#81756E] hover:text-[#3D2B1F] transition-colors"
                  >
                    กลับสู่หน้าสมัครสมาชิก
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="register"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <motion.h2 
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-[#3D2B1F] mb-6 font-prompt"
                >
                  สมัครสมาชิก
                </motion.h2>
                <motion.div 
                  className="grid gap-3 md:grid-cols-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                >
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#4F453F]">ชื่อ-นามสกุล</label>
                    <motion.input 
                      type="text" 
                      value={registerName} 
                      onChange={(event) => setRegisterName(event.target.value)} 
                      placeholder="ชื่อของคุณ" 
                      onFocus={() => setFocusedInput('register-name')}
                      onBlur={() => setFocusedInput(null)}
                      whileFocus={{ scale: 1.005 }}
                      className={`w-full rounded-lg border-2 bg-white px-4 py-3 text-[#1D1B1A] outline-none transition-all duration-300 ${
                        focusedInput === 'register-name' 
                          ? 'border-[#A0724A] ring-3 ring-[#A0724A]/20 shadow-md shadow-[#A0724A]/30' 
                          : 'border-[#D2C4BC] hover:border-[#A0724A]/50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#4F453F]">เบอร์โทรศัพท์</label>
                    <motion.input 
                      type="tel" 
                      value={registerPhone} 
                      onChange={(event) => setRegisterPhone(event.target.value)} 
                      placeholder="08x-xxx-xxxx" 
                      onFocus={() => setFocusedInput('register-phone')}
                      onBlur={() => setFocusedInput(null)}
                      whileFocus={{ scale: 1.005 }}
                      className={`w-full rounded-lg border-2 bg-white px-4 py-3 text-[#1D1B1A] outline-none transition-all duration-300 ${
                        focusedInput === 'register-phone' 
                          ? 'border-[#A0724A] ring-3 ring-[#A0724A]/20 shadow-md shadow-[#A0724A]/30' 
                          : 'border-[#D2C4BC] hover:border-[#A0724A]/50'
                      }`}
                    />
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                >
                  <label className="mb-1.5 block text-sm font-semibold text-[#4F453F]">อีเมล</label>
                  <motion.input 
                    type="email" 
                    value={registerEmail} 
                    onChange={(event) => setRegisterEmail(event.target.value)} 
                    placeholder="example@email.com" 
                    onFocus={() => setFocusedInput('register-email')}
                    onBlur={() => setFocusedInput(null)}
                    whileFocus={{ scale: 1.005 }}
                    className={`w-full rounded-lg border-2 bg-white px-4 py-3 text-[#1D1B1A] outline-none transition-all duration-300 ${
                      focusedInput === 'register-email' 
                        ? 'border-[#A0724A] ring-3 ring-[#A0724A]/20 shadow-md shadow-[#A0724A]/30' 
                        : 'border-[#D2C4BC] hover:border-[#A0724A]/50'
                    }`}
                  />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24 }}
                >
                  <label className="mb-1.5 block text-sm font-semibold text-[#4F453F]">รหัสผ่าน</label>
                  <motion.div 
                    className="relative"
                    whileFocus={{ scale: 1.005 }}
                  >
                    <input 
                      type={showRegisterPassword ? 'text' : 'password'} 
                      value={registerPassword} 
                      onChange={(event) => setRegisterPassword(event.target.value)} 
                      placeholder="••••••••" 
                      onFocus={() => setFocusedInput('register-password')}
                      onBlur={() => setFocusedInput(null)}
                      className={`w-full rounded-lg border-2 bg-white px-4 py-3 pr-12 text-[#1D1B1A] outline-none transition-all duration-300 ${
                        focusedInput === 'register-password' 
                          ? 'border-[#A0724A] ring-3 ring-[#A0724A]/20 shadow-md shadow-[#A0724A]/30' 
                          : 'border-[#D2C4BC] hover:border-[#A0724A]/50'
                      }`}
                    />
                    <motion.button 
                      type="button" 
                      onClick={() => setShowRegisterPassword((current) => !current)} 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#81756E] hover:text-[#3D2B1F] transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">{showRegisterPassword ? 'visibility_off' : 'visibility'}</span>
                    </motion.button>
                  </motion.div>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((index) => (
                        <motion.div 
                          key={index} 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ delay: index * 0.08 }}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            passwordStrength >= index 
                              ? 'bg-gradient-to-r from-[#A0724A] to-[#FFC698] shadow-md shadow-[#A0724A]/30' 
                              : 'bg-[#D2C4BC]'
                          }`}
                        />
                      ))}
                    </div>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`text-xs font-medium ${strengthText.color}`}
                    >
                      {strengthText.text}
                    </motion.p>
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32 }}
                >
                  <label className="mb-1.5 block text-sm font-semibold text-[#4F453F]">ยืนยันรหัสผ่าน</label>
                  <motion.input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(event) => setConfirmPassword(event.target.value)} 
                    placeholder="••••••••" 
                    onFocus={() => setFocusedInput('register-confirm')}
                    onBlur={() => setFocusedInput(null)}
                    whileFocus={{ scale: 1.005 }}
                    className={`w-full rounded-lg border-2 bg-white px-4 py-3 text-[#1D1B1A] outline-none transition-all duration-300 ${
                      focusedInput === 'register-confirm' 
                        ? 'border-[#A0724A] ring-3 ring-[#A0724A]/20 shadow-md shadow-[#A0724A]/30' 
                        : 'border-[#D2C4BC] hover:border-[#A0724A]/50'
                    }`}
                  />
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-4 border-t border-[#D2C4BC]/50"
                >
                  <h4 className="text-sm font-semibold text-[#3D2B1F] mb-3">ที่อยู่จัดส่ง</h4>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.44 }}
                    className="mb-3"
                  >
                    <label className="mb-1.5 block text-xs font-semibold text-[#4F453F]">บ้านเลขที่/อาคาร/ชั้น</label>
                    <motion.input 
                      type="text" 
                      value={houseNo} 
                      onChange={(event) => setHouseNo(event.target.value)} 
                      placeholder="เช่น 123/45 อาคาร A ชั้น 5" 
                      onFocus={() => setFocusedInput('address-houseNo')}
                      onBlur={() => setFocusedInput(null)}
                      whileFocus={{ scale: 1.005 }}
                      className={`w-full rounded-lg border-2 bg-white px-4 py-2.5 text-sm text-[#1D1B1A] outline-none transition-all duration-300 ${
                        focusedInput === 'address-houseNo' 
                          ? 'border-[#A0724A] ring-3 ring-[#A0724A]/20 shadow-md shadow-[#A0724A]/30' 
                          : 'border-[#D2C4BC] hover:border-[#A0724A]/50'
                      }`}
                    />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.48 }}
                    className="grid gap-3 mb-3 md:grid-cols-2"
                  >
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#4F453F]">ซอย</label>
                      <motion.input 
                        type="text" 
                        value={soi} 
                        onChange={(event) => setSoi(event.target.value)} 
                        placeholder="ซอย (ถ้ามี)" 
                        onFocus={() => setFocusedInput('address-soi')}
                        onBlur={() => setFocusedInput(null)}
                        whileFocus={{ scale: 1.005 }}
                        className={`w-full rounded-lg border-2 bg-white px-4 py-2.5 text-sm text-[#1D1B1A] outline-none transition-all duration-300 ${
                          focusedInput === 'address-soi' 
                            ? 'border-[#A0724A] ring-3 ring-[#A0724A]/20 shadow-md shadow-[#A0724A]/30' 
                            : 'border-[#D2C4BC] hover:border-[#A0724A]/50'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#4F453F]">ถนน</label>
                      <motion.input 
                        type="text" 
                        value={road} 
                        onChange={(event) => setRoad(event.target.value)} 
                        placeholder="ถนน (ถ้ามี)" 
                        onFocus={() => setFocusedInput('address-road')}
                        onBlur={() => setFocusedInput(null)}
                        whileFocus={{ scale: 1.005 }}
                        className={`w-full rounded-lg border-2 bg-white px-4 py-2.5 text-sm text-[#1D1B1A] outline-none transition-all duration-300 ${
                          focusedInput === 'address-road' 
                            ? 'border-[#A0724A] ring-3 ring-[#A0724A]/20 shadow-md shadow-[#A0724A]/30' 
                            : 'border-[#D2C4BC] hover:border-[#A0724A]/50'
                        }`}
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.52 }}
                    className="grid gap-3 mb-3 md:grid-cols-3"
                  >
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#4F453F]">แขวง/ตำบล</label>
                      <motion.input 
                        type="text" 
                        value={subDistrict} 
                        onChange={(event) => setSubDistrict(event.target.value)} 
                        placeholder="แขวง/ตำบล" 
                        onFocus={() => setFocusedInput('address-subDistrict')}
                        onBlur={() => setFocusedInput(null)}
                        whileFocus={{ scale: 1.005 }}
                        className={`w-full rounded-lg border-2 bg-white px-4 py-2.5 text-sm text-[#1D1B1A] outline-none transition-all duration-300 ${
                          focusedInput === 'address-subDistrict' 
                            ? 'border-[#A0724A] ring-3 ring-[#A0724A]/20 shadow-md shadow-[#A0724A]/30' 
                            : 'border-[#D2C4BC] hover:border-[#A0724A]/50'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#4F453F]">เขต/อำเภอ</label>
                      <motion.input 
                        type="text" 
                        value={district} 
                        onChange={(event) => setDistrict(event.target.value)} 
                        placeholder="เขต/อำเภอ" 
                        onFocus={() => setFocusedInput('address-district')}
                        onBlur={() => setFocusedInput(null)}
                        whileFocus={{ scale: 1.005 }}
                        className={`w-full rounded-lg border-2 bg-white px-4 py-2.5 text-sm text-[#1D1B1A] outline-none transition-all duration-300 ${
                          focusedInput === 'address-district' 
                            ? 'border-[#A0724A] ring-3 ring-[#A0724A]/20 shadow-md shadow-[#A0724A]/30' 
                            : 'border-[#D2C4BC] hover:border-[#A0724A]/50'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#4F453F]">จังหวัด</label>
                      <motion.input 
                        type="text" 
                        value={province} 
                        onChange={(event) => setProvince(event.target.value)} 
                        placeholder="จังหวัด" 
                        onFocus={() => setFocusedInput('address-province')}
                        onBlur={() => setFocusedInput(null)}
                        whileFocus={{ scale: 1.005 }}
                        className={`w-full rounded-lg border-2 bg-white px-4 py-2.5 text-sm text-[#1D1B1A] outline-none transition-all duration-300 ${
                          focusedInput === 'address-province' 
                            ? 'border-[#A0724A] ring-3 ring-[#A0724A]/20 shadow-md shadow-[#A0724A]/30' 
                            : 'border-[#D2C4BC] hover:border-[#A0724A]/50'
                        }`}
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-3"
                  >
                    <label className="mb-1.5 block text-xs font-semibold text-[#4F453F]">รหัสไปรษณีย์</label>
                    <motion.input 
                      type="text" 
                      value={postalCode} 
                      onChange={(event) => setPostalCode(event.target.value.replace(/\D/g, '').slice(0, 5))} 
                      placeholder="10101" 
                      maxLength={5}
                      onFocus={() => setFocusedInput('address-postalCode')}
                      onBlur={() => setFocusedInput(null)}
                      whileFocus={{ scale: 1.005 }}
                      className={`w-full rounded-lg border-2 bg-white px-4 py-2.5 text-sm text-[#1D1B1A] outline-none transition-all duration-300 ${
                        focusedInput === 'address-postalCode' 
                          ? 'border-[#A0724A] ring-3 ring-[#A0724A]/20 shadow-md shadow-[#A0724A]/30' 
                          : 'border-[#D2C4BC] hover:border-[#A0724A]/50'
                      }`}
                    />
                  </motion.div>
                </motion.div>
                <motion.label 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.64 }}
                  className="flex items-start gap-2.5 text-xs text-[#81756E] cursor-pointer group"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <input 
                      type="checkbox" 
                      checked={agreeTerms} 
                      onChange={(event) => setAgreeTerms(event.target.checked)} 
                      className="mt-0.5 h-4 w-4 rounded-md border-[#D2C4BC] text-[#3D2B1F] focus:ring-[#A0724A] accent-[#3D2B1F] cursor-pointer" 
                    />
                  </motion.div>
                  <span className="group-hover:text-[#3D2B1F] transition-colors">
                    ฉันยอมรับ <a className="text-[#7F5530] hover:underline font-medium" href="#">เงื่อนไขการให้บริการ</a> และ <a className="text-[#7F5530] hover:underline font-medium" href="#">นโยบายความเป็นส่วนตัว</a>
                  </span>
                </motion.label>
                <motion.button 
                  type="button" 
                  disabled={isSubmitting} 
                  onClick={handleRegisterSubmit} 
                  whileHover={{ scale: 1.01, boxShadow: '0 8px 30px -8px rgba(61, 43, 31, 0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.68 }}
                  className="w-full rounded-xl bg-gradient-to-r from-[#3D2B1F] to-[#5D4B3F] py-3.5 text-sm md:text-base font-semibold text-white shadow-lg transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="material-symbols-outlined">refresh</motion.span>
                      กำลังสมัครสมาชิก...
                    </span>
                  ) : (
                    'สมัครสมาชิก'
                  )}
                </motion.button>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.72 }}
                  className="text-center"
                >
                  <p className="text-sm text-[#81756E]">
                    มีบัญชีอยู่แล้ว?{' '}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/login')}
                      className="text-[#7F5530] hover:text-[#A0724A] font-semibold transition-colors"
                    >
                      เข้าสู่ระบบ
                    </motion.button>
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </motion.div>
    </motion.main>
  )
}

export default RegisterPage
