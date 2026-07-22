import { Router } from 'express'
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js'
import { requireAuth, adminOnly } from '../middlewares/auth.js'

const router = Router()

router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', requireAuth, adminOnly, createProduct)
router.put('/:id', requireAuth, adminOnly, updateProduct)
router.delete('/:id', requireAuth, adminOnly, deleteProduct)

export default router
