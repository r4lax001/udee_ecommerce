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
import { requireAuth } from '../middlewares/auth.js'

const router = Router()

// Routes ที่ต้องการ authentication (สำหรับ user ที่ login แล้ว)
router.get('/my', requireAuth, getMyAddresses)
router.post('/my', requireAuth, createMyAddress)

// Routes ทั่วไป (admin)
router.get('/', getAddresses)
router.get('/:id', getAddressById)
router.post('/', createAddress)
router.put('/:id', requireAuth, updateAddress)
router.delete('/:id', requireAuth, deleteAddress)

export default router
