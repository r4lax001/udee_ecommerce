import { Router } from 'express'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js'
import { requireAuth, adminOnly } from '../middlewares/auth.js'

const router = Router()

router.get('/', getCategories)
router.post('/', requireAuth, adminOnly, createCategory)
router.put('/:id', requireAuth, adminOnly, updateCategory)
router.delete('/:id', requireAuth, adminOnly, deleteCategory)

export default router
