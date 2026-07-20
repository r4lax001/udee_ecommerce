import { Router } from 'express'
import {
  getSalesReport,
  getCustomerReport,
  getProductReport,
  getOrderReport
} from '../controllers/reportController.js'
import { requireAuth, adminOnly } from '../middlewares/auth.js'

const router = Router()

router.use(requireAuth)
router.use(adminOnly)

router.get('/sales', getSalesReport)
router.get('/customers', getCustomerReport)
router.get('/products', getProductReport)
router.get('/orders', getOrderReport)

export default router
