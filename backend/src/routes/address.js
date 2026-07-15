import { Router } from 'express'
import {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress
} from '../controllers/addressController.js'

const router = Router()

// GET /api/addresses - ดูที่อยู่ทั้งหมด (สามารถ filter ด้วย userId)
router.get('/', getAddresses)

// GET /api/addresses/:id - ดูที่อยู่ตาม ID
router.get('/:id', getAddressById)

// POST /api/addresses - เพิ่มที่อยู่ใหม่
router.post('/', createAddress)

// PUT /api/addresses/:id - แก้ไขที่อยู่
router.put('/:id', updateAddress)

// DELETE /api/addresses/:id - ลบที่อยู่
router.delete('/:id', deleteAddress)

export default router
