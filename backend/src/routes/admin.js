import express from 'express';
import prisma from '../db.js';
import { requireAuth, adminOnly } from '../middlewares/auth.js';

const router = express.Router();

// Enforce auth and admin filters globally on this router
router.use(requireAuth);
router.use(adminOnly);

/**
 * GET /api/admin/users
 * Returns list of all registered users (excluding password hashes)
 */
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        isSuspended: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Admin GET /users error:', error);
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดภายในระบบเซิร์ฟเวอร์' });
  }
});

/**
 * PUT /api/admin/users/:id/status
 * Updates account flags (isVerified, isSuspended)
 */
router.put('/users/:id/status', async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const { isVerified, isSuspended, role } = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ success: false, message: 'รหัสผู้ใช้งานไม่ถูกต้อง' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้ในระบบ' });
    }

    // Protection to prevent admin from suspending themselves
    if (user.id === req.user.id && isSuspended === true) {
      return res.status(400).json({ success: false, message: 'คุณไม่สามารถระงับการใช้งานบัญชีแอดมินของตนเองได้' });
    }

    const updateData = {};
    if (typeof isVerified === 'boolean') updateData.isVerified = isVerified;
    if (typeof isSuspended === 'boolean') updateData.isSuspended = isSuspended;
    
    if (role && ['CUSTOMER', 'MANAGER', 'ADMIN'].includes(role)) {
      // Protection to prevent admin from demoting themselves
      if (user.id === req.user.id && role !== 'ADMIN') {
        return res.status(400).json({ success: false, message: 'คุณไม่สามารถเปลี่ยนสิทธิ์แอดมินของตนเองได้' });
      }
      updateData.role = role;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        isSuspended: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'อัปเดตสถานะของสมาชิกเสร็จเรียบร้อยแล้ว',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Admin PUT /users/:id/status error:', error);
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดภายในระบบเซิร์ฟเวอร์' });
  }
});

export default router;
