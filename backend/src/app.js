import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import dashboardRouter from './routes/dashboard.js'
import categoryRouter from './routes/category.js'
import productRouter from './routes/product.js'
import orderRouter from './routes/order.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ─── Routes ─────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')))

app.get('/', (req, res) => {
  res.json({ message: 'Udee API is running' })
})

app.use('/api/dashboard', dashboardRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})