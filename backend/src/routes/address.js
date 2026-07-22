import { Router } from 'express'
import {
  getAddresses,
  getAddressById,
  getMyAddresses,
  createAddress,
  createMyAddress,
  updateAddress,
  deleteAddress
} from '../controllers/addressController.js'
import { requireAuth, adminOnly } from '../middlewares/auth.js'

const router = Router()

// Routes ที่ต้องการ authentication (สำหรับ user ที่ login แล้ว)
router.get('/my', requireAuth, getMyAddresses)
router.post('/my', requireAuth, createMyAddress)

// Routes ทั่วไป (admin)
router.get('/', requireAuth, adminOnly, getAddresses)
router.get('/:id', requireAuth, getAddressById)
router.post('/', requireAuth, adminOnly, createAddress)
router.put('/:id', requireAuth, updateAddress)
router.delete('/:id', requireAuth, deleteAddress)

export default router
