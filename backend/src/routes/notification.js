import { Router } from 'express'
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js'
import { requireAuth } from '../middlewares/auth.js'

const router = Router()

// All notification routes require authentication
router.use(requireAuth)

router.get('/', getNotifications)
router.put('/read-all', markAllAsRead)
router.put('/:id/read', markAsRead)

export default router
