import { Router } from 'express'
import { getDashboardStats } from '../controllers/dashboardController.js'
import { requireAuth, adminOnly } from '../middlewares/auth.js'

const router = Router()

router.use(requireAuth)
router.use(adminOnly)

router.get('/', getDashboardStats)

export default router
