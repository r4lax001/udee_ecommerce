import { Router } from 'express'
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js'
import { requireAuth, adminOrManager } from '../middlewares/auth.js'

const router = Router()

router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', requireAuth, adminOrManager, createProduct)
router.put('/:id', requireAuth, adminOrManager, updateProduct)
router.delete('/:id', requireAuth, adminOrManager, deleteProduct)

export default router
