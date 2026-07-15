import { Router } from 'express'
import {
  getSalesReport,
  getCustomerReport,
  getProductReport,
  getOrderReport
} from '../controllers/reportController.js'

const router = Router()

router.get('/sales', getSalesReport)
router.get('/customers', getCustomerReport)
router.get('/products', getProductReport)
router.get('/orders', getOrderReport)

export default router
