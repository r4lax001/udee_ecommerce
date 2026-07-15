import { Router } from 'express'
import {
  getSalesReport,
  getCustomerReport,
  getProductReport,
  getOrderReport
} from '../controllers/reportController.js'

const router = Router()

// GET /api/reports/sales - รายงานยอดขาย
router.get('/sales', getSalesReport)

// GET /api/reports/customers - รายงานลูกค้า
router.get('/customers', getCustomerReport)

// GET /api/reports/products - รายงานสินค้า
router.get('/products', getProductReport)

// GET /api/reports/orders - รายงานออเดอร์
router.get('/orders', getOrderReport)

export default router
