import { useMemo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { authPageData } from "../data/authPageData";
import { useAuth } from "../contexts";
import * as authService from "../services/auth";

// ── ตรวจสอบรูปแบบข้อมูล ──
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
const isValidThaiPhone = (phone) => /^0[0-9]{9}$/.test(phone.trim());

// ── ประเมินความแข็งแกร่งของรหัสผ่าน ──
const getStrength = (value) => {
  let score = 0;
  if (value.length >= 8) score++;
  if (value.length > 12) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  return score;
};

const getStrengthText = (score) => {
  if (score === 0) return { text: "กรุณาใส่รหัสผ่าน", color: "text-[#BA1A1A]" };
  if (score <= 2) return { text: "รหัสผ่านค่อนข้างอ่อน", color: "text-[#BA1A1A]" };
  if (score === 3) return { text: "รหัสผ่านปลอดภัยปานกลาง", color: "text-[#7F5530]" };
  return { text: "รหัสผ่านปลอดภัยมาก", color: "text-[#3D2B1F]" };
};

// ── Toast Notification Component (แทน alert()) ──
const Toast = ({ message, type = 'success', onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-4 shadow-xl text-sm font-medium max-w-sm ${
      type === 'success' ? 'bg-[#3D2B1F] text-white' : 'bg-[#FFDBD6] text-[#7F1A18]'
    }`}
  >
    <span className="material-symbols-outlined text-base">
      {type === 'success' ? 'check_circle' : 'error'}
    </span>
    <span>{message}</span>
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
      <span className="material-symbols-outlined text-base">close</span>
    </button>
  </motion.div>
);

const AuthPage = ({ authData = authPageData }) => {
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const transition = {
    duration: reduceMotion ? 0 : 0.24,
    ease: [0.22, 1, 0.36, 1],
  };
  
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'register' | 'otp'
  
  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // OTP states
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpResendCooldown, setOtpResendCooldown] = useState(0); // countdown วินาที
  
  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toast, setToast] = useState(null); // { message, type }

  // ── Toast helper ──
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // ── OTP resend countdown timer ──
  useEffect(() => {
    if (otpResendCooldown <= 0) return;
    const timer = setTimeout(() => setOtpResendCooldown(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpResendCooldown]);

  const passwordStrength = useMemo(
    () => getStrength(registerPassword),
    [registerPassword],
  );

  const handleTabChange = (type) => {
    setActiveTab(type);
    setErrorMessage("");
  };

  const handleLoginSubmit = async () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage("กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน");
      return;
    }
    if (!isValidEmail(loginEmail)) {
      setErrorMessage("รูปแบบอีเมลไม่ถูกต้อง");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const data = await authService.login(loginEmail.trim(), loginPassword);
      if (data.success) {
        login(data.token, data.user);
        showToast("เข้าสู่ระบบสำเร็จ ยินดีต้อนรับ!");
        setTimeout(() => {
          if (data.user.role === "ADMIN") {
            navigate("/admin-dashboard");
          } else {
            navigate("/");
          }
        }, 800);
      } else if (data.needsVerification) {
        setOtpEmail(data.email);
        setOtpCode("");
        setOtpResendCooldown(60);
        setActiveTab("otp");
        setErrorMessage(data.message || "บัญชีของคุณยังไม่เปิดใช้งาน กรุณากรอกรหัส OTP ที่ส่งไปยังอีเมลของคุณ");
      } else {
        setErrorMessage(data.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async () => {
    if (
      !registerName.trim() ||
      !registerPhone.trim() ||
      !registerEmail.trim() ||
      !registerPassword.trim() ||
      !confirmPassword.trim()
    ) {
      setErrorMessage("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    if (!isValidEmail(registerEmail)) {
      setErrorMessage("รูปแบบอีเมลไม่ถูกต้อง (เช่น example@email.com)");
      return;
    }

    if (!isValidThaiPhone(registerPhone)) {
      setErrorMessage("รูปแบบเบอร์โทรไม่ถูกต้อง (กรุณากรอก 10 หลัก เช่น 0812345678)");
      return;
    }

    if (registerPassword.length < 8) {
      setErrorMessage("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }

    if (!/[A-Z]/.test(registerPassword)) {
      setErrorMessage("รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว (เช่น A-Z)");
      return;
    }

    if (!/[0-9]/.test(registerPassword)) {
      setErrorMessage("รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว (เช่น 0-9)");
      return;
    }

    if (registerPassword !== confirmPassword) {
      setErrorMessage("รหัสผ่านและยืนยันรหัสผ่านต้องตรงกัน");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("กรุณายอมรับเงื่อนไขการให้บริการและนโยบายความเป็นส่วนตัว");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const data = await authService.register(
        registerName.trim(),
        registerEmail.trim(),
        registerPassword,
        registerPhone.trim()
      );
      if (data.success) {
        setOtpEmail(registerEmail.trim());
        setOtpCode("");
        setOtpResendCooldown(60);
        setActiveTab("otp");
        showToast("สมัครสมาชิกสำเร็จ! รหัส OTP ถูกส่งไปที่อีเมลของคุณแล้ว");
      } else {
        setErrorMessage(data.message || "การสมัครสมาชิกไม่สำเร็จ");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!/^\d{6}$/.test(otpCode)) {
      setErrorMessage("กรุณากรอกรหัส OTP ให้ครบ 6 หลัก (ตัวเลขเท่านั้น)");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const data = await authService.verifyOtp(otpEmail, otpCode);
      if (data.success) {
        login(data.token, data.user);
        showToast("ยืนยันตัวตนสำเร็จ! ยินดีต้อนรับสู่ UDEE Furniture");
        setTimeout(() => {
          if (data.user.role === "ADMIN") {
            navigate("/admin-dashboard");
          } else {
            navigate("/");
          }
        }, 800);
      } else {
        setErrorMessage(data.message || "รหัส OTP ไม่ถูกต้อง");
        if (data.tooManyAttempts) {
          setOtpCode("");
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการยืนยันตัวตน กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpResendCooldown > 0) return;
    setErrorMessage("");
    try {
      const data = await authService.resendOtp(otpEmail);
      if (data.success) {
        setOtpResendCooldown(60);
        setOtpCode("");
        showToast("ส่งรหัส OTP ใหม่เรียบร้อยแล้ว กรุณาตรวจสอบอีเมลของคุณ");
      } else {
        setErrorMessage(data.message || "ไม่สามารถส่งรหัส OTP ได้");
        if (data.cooldownSeconds) setOtpResendCooldown(data.cooldownSeconds);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการส่งรหัส OTP"
      );
    }
  };

  const strengthText = getStrengthText(passwordStrength);

  return (
    <motion.main
      className="min-h-screen bg-[#FAF6F1] text-[#1D1B1A] flex items-center justify-center p-0 md:p-6"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition}
    >
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
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
            <h1 className="mb-2 text-4xl font-semibold md:text-5xl">
              {authData.brand}
            </h1>
            <p className="mb-10 text-2xl font-medium leading-tight text-[#FFF1E7] md:text-3xl">
              {authData.title}
            </p>
            <div className="space-y-4">
              {authData.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-4 text-base md:text-lg"
                >
                  <span
                    className="material-symbols-outlined text-[#FFC698]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-16 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
            <p className="text-sm italic text-[#F3ECEA]/90">
              {authData.testimonial}
            </p>
          </div>

          <div
            className="pointer-events-none absolute bottom-0 right-0 h-32 w-full opacity-20 bg-no-repeat bg-bottom bg-contain"
            style={{ backgroundImage: `url('${authData.backgroundImage}')` }}
          />
        </motion.section>

        <motion.section
          className="flex w-full flex-col bg-[#FAF6F1] px-6 py-8 md:w-[60%] md:px-12 md:py-12"
          initial={reduceMotion ? false : { x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ ...transition, delay: 0.15 }}
        >
          <div className="md:hidden mb-8">
            <h2 className="text-4xl font-semibold text-[#3D2B1F]">
              {authData.brand}
            </h2>
          </div>

          {activeTab !== "otp" && (
            <div className="mb-10 flex border-b border-[#D2C4BC]">
              <button
                type="button"
                onClick={() => handleTabChange("login")}
                className={`px-6 py-3 text-base font-medium transition ${
                  activeTab === "login"
                    ? "border-b-2 border-[#3D2B1F] text-[#3D2B1F]"
                    : "border-b-2 border-transparent text-[#81756E] hover:text-[#3D2B1F]"
                }`}
              >
                เข้าสู่ระบบ
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("register")}
                className={`px-6 py-3 text-base font-medium transition ${
                  activeTab === "register"
                    ? "border-b-2 border-[#3D2B1F] text-[#3D2B1F]"
                    : "border-b-2 border-transparent text-[#81756E] hover:text-[#3D2B1F]"
                }`}
              >
                สมัครสมาชิก
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-[#FFDBD6] px-4 py-4 text-[#7F1A18]">
              <span className="material-symbols-outlined">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {activeTab === "otp" ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[#3D2B1F] mb-1">ยืนยันที่อยู่อีเมลของคุณ</h3>
                <p className="text-sm text-[#81756E] mb-6">
                  ระบบได้ส่งรหัส OTP 6 หลักไปที่ <span className="font-medium text-[#3D2B1F]">{otpEmail}</span> กรุณากรอกรหัสดังกล่าวเพื่อยืนยันความเป็นเจ้าของบัญชี
                </p>
                <label className="mb-2 block text-sm font-medium text-[#4F453F]">
                  รหัสยืนยัน OTP (6 หลัก)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full text-center text-3xl tracking-[12px] font-bold rounded-md border border-[#D2C4BC] bg-white px-4 py-3 text-[#1D1B1A] outline-none transition focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
                />
              </div>

              <button
                type="button"
                disabled={otpCode.length !== 6 || isSubmitting}
                onClick={handleOtpSubmit}
                className="w-full rounded-xl bg-[#3D2B1F] py-3 text-base font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? "กำลังยืนยัน..." : "ยืนยันรหัส OTP"}
              </button>

              <div className="flex flex-col items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={otpResendCooldown > 0}
                  className={`text-sm font-medium transition ${
                    otpResendCooldown > 0
                      ? 'text-[#81756E] cursor-not-allowed'
                      : 'text-[#7F5530] hover:underline'
                  }`}
                >
                  {otpResendCooldown > 0
                    ? `ส่งรหัสใหม่ได้ใน ${otpResendCooldown} วินาที`
                    : 'ส่งรหัส OTP อีกครั้ง'
                  }
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("login");
                    setErrorMessage("");
                  }}
                  className="text-sm text-[#81756E] hover:text-[#3D2B1F]"
                >
                  กลับสู่หน้าเข้าสู่ระบบ
                </button>
              </div>
            </div>
          ) : activeTab === "login" ? (
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4F453F]">
                  อีเมล
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  placeholder="example@email.com"
                  className="w-full rounded-md border border-[#D2C4BC] bg-white px-4 py-3 text-[#1D1B1A] outline-none transition focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4F453F]">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? "text" : "password"}
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
                      {showLoginPassword ? "visibility_off" : "visibility"}
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
                disabled={isSubmitting}
                onClick={handleLoginSubmit}
                className="w-full rounded-xl bg-[#3D2B1F] py-3 text-base font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
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
                    <img
                      src={provider.icon}
                      alt={provider.name}
                      className="h-5 w-5"
                    />
                    <span>{provider.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#4F453F]">
                    ชื่อ-นามสกุล
                  </label>
                  <input
                    type="text"
                    value={registerName}
                    onChange={(event) => setRegisterName(event.target.value)}
                    placeholder="ชื่อของคุณ"
                    className="w-full rounded-md border border-[#D2C4BC] bg-white px-4 py-3 text-[#1D1B1A] outline-none transition focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#4F453F]">
                    เบอร์โทรศัพท์
                  </label>
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
                <label className="mb-2 block text-sm font-medium text-[#4F453F]">
                  อีเมล
                </label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(event) => setRegisterEmail(event.target.value)}
                  placeholder="example@email.com"
                  className="w-full rounded-md border border-[#D2C4BC] bg-white px-4 py-3 text-[#1D1B1A] outline-none transition focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4F453F]">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    value={registerPassword}
                    onChange={(event) =>
                      setRegisterPassword(event.target.value)
                    }
                    placeholder="••••••••"
                    className="w-full rounded-md border border-[#D2C4BC] bg-white px-4 py-3 pr-20 text-[#1D1B1A] outline-none transition focus:border-[#A0724A] focus:ring-2 focus:ring-[#A0724A]/20"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowRegisterPassword((current) => !current)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#81756E] hover:text-[#3D2B1F]"
                  >
                    <span className="material-symbols-outlined">
                      {showRegisterPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                <div className="mt-3 flex gap-2">
                  {[1, 2, 3, 4].map((index) => (
                    <div
                      key={index}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        passwordStrength >= index
                          ? passwordStrength >= 3 ? "bg-[#3D2B1F]" : "bg-[#A0724A]"
                          : "bg-[#D2C4BC]"
                      }`}
                    />
                  ))}
                </div>
                <p className={`mt-2 text-sm ${strengthText.color}`}>
                  {strengthText.text}
                </p>
                <ul className="mt-2 space-y-1">
                  {[
                    { ok: registerPassword.length >= 8, label: "ความยาวอย่างน้อย 8 ตัวอักษร" },
                    { ok: /[A-Z]/.test(registerPassword), label: "มีตัวพิมพ์ใหญ่ (A-Z)" },
                    { ok: /[0-9]/.test(registerPassword), label: "มีตัวเลข (0-9)" },
                  ].map(({ ok, label }) => (
                    <li key={label} className={`flex items-center gap-2 text-xs transition-colors ${ok ? 'text-[#3D2B1F]' : 'text-[#81756E]'}`}>
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {ok ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4F453F]">
                  ยืนยันรหัสผ่าน
                </label>
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
                  ฉันยอมรับ{" "}
                  <a className="text-[#7F5530] hover:underline" href="#">
                    เงื่อนไขการให้บริการ
                  </a>{" "}
                  และ{" "}
                  <a className="text-[#7F5530] hover:underline" href="#">
                    นโยบายความเป็นส่วนตัว
                  </a>
                </span>
              </label>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleRegisterSubmit}
                className="w-full rounded-xl bg-[#3D2B1F] py-3 text-base font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
              </button>
            </div>
          )}

          <div className="mt-auto pt-10 text-center text-sm text-[#81756E] md:pt-16">
            © 2024 UDEE Furniture. Crafted for the quiet luxury of home.
          </div>
        </motion.section>
      </motion.div>
    </motion.main>
  );
};

export default AuthPage;
