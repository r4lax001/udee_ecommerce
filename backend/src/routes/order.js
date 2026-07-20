import { Router } from 'express'
import { getOrders, getOrderById, getMyOrders, createOrder, updateOrderStatus } from '../controllers/orderController.js'
import { requireAuth } from '../middlewares/auth.js'

const router = Router()

router.get('/my', requireAuth, getMyOrders)
router.get('/', getOrders)
router.get('/:id', getOrderById)
router.post('/', createOrder)
router.put('/:id/status', updateOrderStatus)

export default router

