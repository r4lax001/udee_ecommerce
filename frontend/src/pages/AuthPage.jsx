import { useMemo, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { authPageData } from '../data/authPageData'


const getStrength = (value) => {
  let score = 0
  if (value.length > 5) score++
  if (value.length > 8) score++
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

const AuthPage = ({ authData = authPageData }) => {
  const reduceMotion = useReducedMotion()
  const transition = { duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }
  const [activeTab, setActiveTab] = useState('login')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [registerName, setRegisterName] = useState('')
  const [registerPhone, setRegisterPhone] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const passwordStrength = useMemo(
    () => getStrength(registerPassword),
    [registerPassword],
  )

  const handleTabChange = (type) => {
    setActiveTab(type)
    setErrorMessage('')
  }

  const handleLoginSubmit = () => {
    if (!loginEmail || !loginPassword) {
      setErrorMessage('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน')
      return
    }
    setErrorMessage('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง')
  }

  const handleRegisterSubmit = () => {
    if (!registerName || !registerPhone || !registerEmail || !registerPassword || !confirmPassword) {
      setErrorMessage('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วนและยอมรับเงื่อนไขการใช้งาน')
      return
    }
    if (registerPassword !== confirmPassword) {
      setErrorMessage('รหัสผ่านและยืนยันรหัสผ่านต้องตรงกัน')
      return
    }
    if (!agreeTerms) {
      setErrorMessage('กรุณายอมรับเงื่อนไขการให้บริการและนโยบายความเป็นส่วนตัว')
      return
    }
    setErrorMessage('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วนและยอมรับเงื่อนไขการใช้งาน')
  }

  const strengthText = getStrengthText(passwordStrength)

  return (
    <motion.main
      className="min-h-screen bg-[#FAF6F1] text-[#1D1B1A] flex items-center justify-center p-0 md:p-6"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition}
    >
      <motion.div
        className="w-full max-w-[1280px] min-h-[800px] flex flex-col overflow-hidden bg-white md:flex-row md:rounded-[1.5rem] shadow-[0_2px_8px_rgba(61,43,31,0.08)]"
        initial={reduceMotion ? false : { scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={transition}
      >
        <motion.section
          className="relative flex w-full flex-col justify-between bg-[#3D2B1F] px-8 py-10 text-[#F3ECEA] md:w-[40%] md:px-12 md:py-16"
          initial={reduceMotion ? false : { x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ ...transition, delay: 0.1 }}
        >
          <div className="absolute top-[-10%] right-[-10%] h-64 w-64 rounded-full bg-[#FFC698] opacity-10 blur-3xl" />
          <div className="absolute bottom-[-5%] left-[-5%] h-48 w-48 rounded-full bg-[#3F2B0F] opacity-20 blur-2xl" />
          <div className="relative z-10">
            <h1 className="mb-2 text-4xl font-semibold md:text-5xl">{authData.brand}</h1>
            <p className="mb-10 text-2xl font-medium leading-tight text-[#FFF1E7] md:text-3xl">
              {authData.title}
            </p>
            <div className="space-y-4">
              {authData.features.map((feature) => (
                <div key={feature} className="flex items-center gap-4 text-base md:text-lg">
                  <span className="material-symbols-outlined text-[#FFC698]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-16 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
            <p className="text-sm italic text-[#F3ECEA]/90">{authData.testimonial}</p>
          </div>

          <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-full opacity-20 bg-no-repeat bg-bottom bg-contain" style={{ backgroundImage: `url('${authData.backgroundImage}')` }} />
        </motion.section>

        <motion.section
          className="flex w-full flex-col bg-[#FAF6F1] px-6 py-8 md:w-[60%] md:px-12 md:py-12"
          initial={reduceMotion ? false : { x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ ...transition, delay: 0.15 }}
        >
          <div className="md:hidden mb-8">
            <h2 className="text-4xl font-semibold text-[#3D2B1F]">{authData.brand}</h2>
          </div>

          <div className="mb-10 flex border-b border-[#D2C4BC]">
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              className={`px-6 py-3 text-base font-medium transition ${
                activeTab === 'login'
                  ? 'border-b-2 border-[#3D2B1F] text-[#3D2B1F]'
                  : 'border-b-2 border-transparent text-[#81756E] hover:text-[#3D2B1F]'
              }`}
            >
              เข้าสู่ระบบ
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('register')}
              className={`px-6 py-3 text-base font-medium transition ${
                activeTab === 'register'
                  ? 'border-b-2 border-[#3D2B1F] text-[#3D2B1F]'
                  : 'border-b-2 border-transparent text-[#81756E] hover:text-[#3D2B1F]'
              }`}
            >
              สมัครสมาชิก
            </button>
          </div>

          {errorMessage && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-[#FFDBD6] px-4 py-4 text-[#7F1A18]">
              <span className="material-symbols-outlined">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4F453F]">อีเมล</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  placeholder="example@email.com"
                  className="w-full rounded-md border border-[#D2C4BC] bg-white px-4 py-3 text-[#1D1B1A] outline-none transition focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4F453F]">รหัสผ่าน</label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-md border border-[#D2C4BC] bg-white px-4 py-3 pr-20 text-[#1D1B1A] outline-none transition focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#81756E] hover:text-[#3D2B1F]"
                  >
                    <span className="material-symbols-outlined">
                      {showLoginPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 text-sm text-[#81756E]">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-[#D2C4BC] text-[#3D2B1F] focus:ring-[#A0724A]"
                  />
                  จดจำฉันไว้
                </label>
                <a className="text-sm text-[#7F5530] hover:underline" href="#">
                  ลืมรหัสผ่าน?
                </a>
              </div>
              <button
                type="button"
                onClick={handleLoginSubmit}
                className="w-full rounded-xl bg-[#3D2B1F] py-3 text-base font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-95"
              >
                เข้าสู่ระบบ
              </button>
              <div className="my-8 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#D2C4BC]" />
                <span className="text-sm uppercase text-[#81756E]">หรือ</span>
                <div className="h-px flex-1 bg-[#D2C4BC]" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {authData.socialProviders.map((provider) => (
                  <button
                    key={provider.name}
                    type="button"
                    className="flex items-center justify-center gap-3 rounded-xl border border-[#D2C4BC] bg-white py-3 text-sm font-medium text-[#1D1B1A] transition hover:bg-[#F3ECEA]"
                  >
                    <img src={provider.icon} alt={provider.name} className="h-5 w-5" />
                    <span>{provider.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#4F453F]">ชื่อ-นามสกุล</label>
                  <input
                    type="text"
                    value={registerName}
                    onChange={(event) => setRegisterName(event.target.value)}
                    placeholder="ชื่อของคุณ"
                    className="w-full rounded-md border border-[#D2C4BC] bg-white px-4 py-3 text-[#1D1B1A] outline-none transition focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#4F453F]">เบอร์โทรศัพท์</label>
                  <input
                    type="tel"
                    value={registerPhone}
                    onChange={(event) => setRegisterPhone(event.target.value)}
                    placeholder="08x-xxx-xxxx"
                    className="w-full rounded-md border border-[#D2C4BC] bg-white px-4 py-3 text-[#1D1B1A] outline-none transition focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4F453F]">อีเมล</label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(event) => setRegisterEmail(event.target.value)}
                  placeholder="example@email.com"
                  className="w-full rounded-md border border-[#D2C4BC] bg-white px-4 py-3 text-[#1D1B1A] outline-none transition focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4F453F]">รหัสผ่าน</label>
                <div className="relative">
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    value={registerPassword}
                    onChange={(event) => setRegisterPassword(event.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-md border border-[#D2C4BC] bg-white px-4 py-3 pr-20 text-[#1D1B1A] outline-none transition focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#81756E] hover:text-[#3D2B1F]"
                  >
                    <span className="material-symbols-outlined">
                      {showRegisterPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <div className="mt-3 flex gap-2">
                  {[1, 2, 3, 4].map((index) => (
                    <div
                      key={index}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        passwordStrength >= index ? 'bg-[#7F5530]' : 'bg-[#D2C4BC]'
                      }`}
                    />
                  ))}
                </div>
                <p className={`mt-2 text-sm ${strengthText.color}`}>{strengthText.text}</p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4F453F]">ยืนยันรหัสผ่าน</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-[#D2C4BC] bg-white px-4 py-3 text-[#1D1B1A] outline-none transition focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
                />
              </div>
              <label className="flex items-start gap-3 text-sm text-[#81756E]">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(event) => setAgreeTerms(event.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-[#D2C4BC] text-[#3D2B1F] focus:ring-[#A0724A]"
                />
                <span>
                  ฉันยอมรับ <a className="text-[#7F5530] hover:underline" href="#">เงื่อนไขการให้บริการ</a> และ{' '}
                  <a className="text-[#7F5530] hover:underline" href="#">นโยบายความเป็นส่วนตัว</a>
                </span>
              </label>
              <button
                type="button"
                onClick={handleRegisterSubmit}
                className="w-full rounded-xl bg-[#3D2B1F] py-3 text-base font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-95"
              >
                สมัครสมาชิก
              </button>
            </div>
          )}

          <div className="mt-auto pt-10 text-center text-sm text-[#81756E] md:pt-16">
            © 2024 UDEE Furniture. Crafted for the quiet luxury of home.
          </div>
        </motion.section>
      </motion.div>
    </motion.main>
  )
}

export default AuthPage
