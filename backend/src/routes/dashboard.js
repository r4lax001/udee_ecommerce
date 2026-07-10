import { Router } from 'express'
import { getDashboardStats } from '../controllers/dashboardController.js'

const router = Router()

// GET /api/dashboard — ดึงข้อมูล dashboard ทั้งหมด
router.get('/', getDashboardStats)

export default router
