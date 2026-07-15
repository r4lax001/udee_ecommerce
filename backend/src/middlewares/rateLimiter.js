import rateLimit from 'express-rate-limit';

// ──────────────────────────────────────────────────────────────────────────────
// Auth Limiter – สำหรับ /login และ /register
// จำกัด 10 ครั้งต่อ 15 นาที ต่อ IP
// ──────────────────────────────────────────────────────────────────────────────
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 นาที
  max: 10,
  message: {
    success: false,
    message: 'มีการร้องขอเข้าสู่ระบบหรือสมัครสมาชิกบ่อยเกินไป กรุณาลองใหม่อีกครั้งใน 15 นาที',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // นับแม้แต่การร้องขอที่สำเร็จ
});

// ──────────────────────────────────────────────────────────────────────────────
// OTP Limiter – สำหรับ /verify-otp
// จำกัด 10 ครั้งต่อ 10 นาที ต่อ IP
// ──────────────────────────────────────────────────────────────────────────────
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 นาที
  max: 10,
  message: {
    success: false,
    message: 'มีการทำรายการยืนยัน OTP บ่อยเกินไป กรุณาลองใหม่อีกครั้งใน 10 นาที',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ──────────────────────────────────────────────────────────────────────────────
// Resend OTP Limiter – สำหรับ /resend-otp
// เข้มงวดกว่า: จำกัด 3 ครั้งต่อ 10 นาที ต่อ IP ป้องกัน email spam
// ──────────────────────────────────────────────────────────────────────────────
export const resendOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 นาที
  max: 3, // ขอรหัสใหม่ได้สูงสุด 3 ครั้งต่อ 10 นาที
  message: {
    success: false,
    message: 'คุณขอรหัส OTP บ่อยเกินไป กรุณาลองใหม่อีกครั้งใน 10 นาที',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
