import { Router } from 'express'
import { getOrders, getOrderById, getMyOrders, createOrder, updateOrderStatus } from '../controllers/orderController.js'
import { requireAuth, adminOnly } from '../middlewares/auth.js'

const router = Router()

router.get('/my', requireAuth, getMyOrders)
router.get('/', requireAuth, adminOnly, getOrders)
router.get('/:id', requireAuth, getOrderById)
router.post('/', requireAuth, createOrder)
router.put('/:id/status', requireAuth, adminOnly, updateOrderStatus)

export default router

