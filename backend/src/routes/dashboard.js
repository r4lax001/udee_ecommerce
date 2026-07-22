import { Router } from 'express'
import { getDashboardStats } from '../controllers/dashboardController.js'
import { requireAuth, adminOrManager } from '../middlewares/auth.js'

const router = Router()

router.use(requireAuth)
router.use(adminOrManager)

router.get('/', getDashboardStats)

export default router
