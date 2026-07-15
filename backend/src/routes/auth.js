import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../db.js';
import { sendOTPEmail } from '../utils/mail.js';
import { requireAuth } from '../middlewares/auth.js';
import { authLimiter, otpLimiter, resendOtpLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'udee_secret_key_2024';
const OTP_MAX_ATTEMPTS = 5; // จำนวนครั้งสูงสุดที่อนุญาตให้กรอก OTP ผิด

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

/**
 * สร้าง OTP 6 หลักโดยใช้ Cryptographically Secure PRNG
 * แทนที่ Math.random() ที่ไม่ปลอดภัยพอสำหรับ security use-case
 */
const generateOTP = () => {
  return (crypto.randomInt(100000, 999999)).toString();
};

/**
 * ตรวจสอบรูปแบบอีเมล
 */
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

/**
 * ตรวจสอบรูปแบบเบอร์โทรศัพท์ไทย (0xxxxxxxxx = 10 หลัก)
 */
const isValidThaiPhone = (phone) => /^0[0-9]{9}$/.test(phone.trim());

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// ──────────────────────────────────────────────────────────────────────────────
/**
 * สมัครสมาชิกใหม่ แฮชรหัสผ่าน สร้าง OTP และส่งอีเมลยืนยัน
 */
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // ── ตรวจสอบข้อมูลที่จำเป็น ──
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'รูปแบบอีเมลไม่ถูกต้อง' });
    }

    if (!isValidThaiPhone(phone)) {
      return res.status(400).json({ success: false, message: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (กรุณากรอก 10 หลัก เช่น 0812345678)' });
    }

    // ── ตรวจสอบความแข็งแกร่งของรหัสผ่าน ──
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร' });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ success: false, message: 'รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว' });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ success: false, message: 'รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว' });
    }

    if (name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({ success: false, message: 'ชื่อต้องมีความยาว 2–100 ตัวอักษร' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      // ส่ง response เดียวกันเพื่อป้องกัน Email Enumeration Attack
      return res.status(400).json({ success: false, message: 'ไม่สามารถสมัครสมาชิกด้วยข้อมูลนี้ได้ กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง' });
    }

    const hashedPassword = await bcrypt.hash(password, 12); // cost factor 12 (ปลอดภัยกว่า 10)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 นาที

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone.trim(),
        otpCode: otp,
        otpExpiry,
        otpAttempts: 0,
        isVerified: false,
      },
    });

    await sendOTPEmail(user.email, otp);

    return res.status(201).json({
      success: true,
      message: 'สมัครสมาชิกสำเร็จ รหัส OTP สำหรับยืนยันตัวตนถูกส่งไปที่อีเมลของคุณแล้ว',
      email: user.email,
      needsVerification: true,
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดภายในระบบเซิร์ฟเวอร์' });
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/verify-otp
// ──────────────────────────────────────────────────────────────────────────────
/**
 * ตรวจสอบรหัส OTP 6 หลัก พร้อมนับจำนวนครั้งที่กรอกผิด
 */
router.post('/verify-otp', otpLimiter, async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลอีเมลและรหัส OTP ให้ครบถ้วน' });
    }

    if (!/^\d{6}$/.test(otpCode)) {
      return res.status(400).json({ success: false, message: 'รหัส OTP ต้องเป็นตัวเลข 6 หลักเท่านั้น' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // ไม่เปิดเผยว่ามีหรือไม่มี user เพื่อป้องกัน Email Enumeration
    if (!user || user.isVerified) {
      return res.status(400).json({ success: false, message: 'ข้อมูล OTP ไม่ถูกต้องหรือบัญชีนี้ได้รับการยืนยันแล้ว' });
    }

    if (!user.otpCode || !user.otpExpiry) {
      return res.status(400).json({ success: false, message: 'ไม่พบข้อมูลคำขอยืนยันตัวตนหรือรหัส OTP หมดอายุแล้ว กรุณาส่งใหม่อีกครั้ง' });
    }

    // ── ตรวจสอบจำนวนครั้งที่กรอกผิด ──
    if (user.otpAttempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({
        success: false,
        message: `คุณกรอกรหัส OTP ผิดเกิน ${OTP_MAX_ATTEMPTS} ครั้ง กรุณากดขอรหัสใหม่`,
        tooManyAttempts: true,
      });
    }

    // ── ตรวจสอบเวลาหมดอายุก่อน ──
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ success: false, message: 'รหัส OTP หมดอายุการใช้งานแล้ว กรุณากดส่งใหม่อีกครั้ง' });
    }

    // ── เปรียบเทียบ OTP ด้วย timing-safe method ──
    const isOtpValid = crypto.timingSafeEqual(
      Buffer.from(user.otpCode.padEnd(6, '0')),
      Buffer.from(otpCode.padEnd(6, '0'))
    );

    if (!isOtpValid) {
      // เพิ่ม attempt count
      await prisma.user.update({
        where: { id: user.id },
        data: { otpAttempts: user.otpAttempts + 1 },
      });
      const remaining = OTP_MAX_ATTEMPTS - (user.otpAttempts + 1);
      return res.status(400).json({
        success: false,
        message: `รหัส OTP ไม่ถูกต้อง (เหลือ ${Math.max(0, remaining)} ครั้ง)`,
      });
    }

    // ── OTP ถูกต้อง – ยืนยันบัญชีและล้างข้อมูล OTP ──
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otpCode: null,
        otpExpiry: null,
        otpAttempts: 0,
      },
    });

    const token = jwt.sign(
      { userId: updatedUser.id, email: updatedUser.email, role: updatedUser.role },
      JWT_SECRET,
      { expiresIn: '2h' } // ลดจาก 7d เหลือ 2h เพื่อความปลอดภัย
    );

    return res.status(200).json({
      success: true,
      message: 'ยืนยันตัวตนสำเร็จ',
      token,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดภายในระบบเซิร์ฟเวอร์' });
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/resend-otp
// ──────────────────────────────────────────────────────────────────────────────
/**
 * สร้างและส่ง OTP ชุดใหม่ พร้อม Cooldown 60 วินาที ป้องกัน email spam
 */
router.post('/resend-otp', resendOtpLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'กรุณาระบุอีเมลที่ถูกต้อง' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // ไม่เปิดเผยว่ามี user จริงหรือไม่ (anti-enumeration)
    if (!user || user.isVerified) {
      return res.status(200).json({
        success: true,
        message: 'หากอีเมลนี้ถูกลงทะเบียนในระบบและยังไม่ได้ยืนยัน รหัส OTP ใหม่จะถูกส่งไปให้',
      });
    }

    // ── Cooldown: ป้องกันขอซ้ำถี่เกินไป (60 วินาที) ──
    if (user.otpExpiry) {
      const secondsLeft = Math.ceil((new Date(user.otpExpiry).getTime() - 9 * 60 * 1000 - Date.now()) / 1000);
      if (secondsLeft > 0) {
        return res.status(429).json({
          success: false,
          message: `กรุณารอ ${secondsLeft} วินาที ก่อนขอรหัส OTP ใหม่`,
          cooldownSeconds: secondsLeft,
        });
      }
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: otp, otpExpiry, otpAttempts: 0 }, // reset attempts ด้วย
    });

    await sendOTPEmail(user.email, otp);

    return res.status(200).json({
      success: true,
      message: 'ส่งรหัส OTP ยืนยันตัวตนใหม่ไปยังอีเมลของคุณแล้ว',
      email: user.email,
    });
  } catch (error) {
    console.error('Resend OTP Error:', error);
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดภายในระบบเซิร์ฟเวอร์' });
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────────────────────────────────────────────
/**
 * ตรวจสอบ email และ password พร้อมจัดการกรณียังไม่ verified และถูก suspend
 */
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'กรุณากรอกอีเมลและรหัสผ่าน' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'รูปแบบอีเมลไม่ถูกต้อง' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // ── ตรวจสอบ password ก่อนเสมอ เพื่อป้องกัน timing-based user enumeration ──
    // เปรียบ hash แม้ไม่มี user จริง (dummy hash)
    const dummyHash = '$2a$12$invalidhashfordummycomparison000000000000000000000000000';
    const passwordToCompare = user ? user.password : dummyHash;
    const isPasswordValid = await bcrypt.compare(password, passwordToCompare);

    if (!user || !isPasswordValid) {
      return res.status(401).json({ success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    // ── ตรวจสอบสถานะบัญชีหลังจาก password ถูกต้องแล้ว ──
    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: 'บัญชีของคุณถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบเพื่อทำการตรวจสอบ',
      });
    }

    // ── Force OTP ถ้ายังไม่ได้ verify ──
    if (!user.isVerified) {
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: { otpCode: otp, otpExpiry, otpAttempts: 0 },
      });

      await sendOTPEmail(email, otp);

      return res.status(200).json({
        success: false,
        needsVerification: true,
        message: 'บัญชีของคุณยังไม่ได้ยืนยันอีเมล รหัส OTP ใหม่ถูกส่งไปยังอีเมลของคุณแล้ว',
        email: user.email,
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดภายในระบบเซิร์ฟเวอร์' });
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/auth/me
// ──────────────────────────────────────────────────────────────────────────────
/**
 * โหลดโปรไฟล์ผู้ใช้งานที่ล็อกอินอยู่
 */
router.get('/me', requireAuth, async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      isVerified: req.user.isVerified,
      createdAt: req.user.createdAt,
    },
  });
});

export default router;
