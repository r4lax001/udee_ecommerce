import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import dashboardRouter from './routes/dashboard.js'
import categoryRouter from './routes/category.js'
import productRouter from './routes/product.js'
import orderRouter from './routes/order.js'
import addressRouter from './routes/address.js'
import reportRouter from './routes/report.js'
import uploadRouter from './routes/upload.js'
import notificationRouter from './routes/notification.js'

dotenv.config()

const app = express()

app.use(helmet())

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map(o => o.trim())

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error(`CORS: Origin "${origin}" is not allowed`), false)
  },
  credentials: true,
}))

app.use(express.json({ limit: '10mb' }))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)
app.use('/api/addresses', addressRouter)
app.use('/api/reports', reportRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/notifications', notificationRouter)

app.get('/', (req, res) => {
  res.json({ message: 'Udee API is running' })
})

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'ไม่พบเส้นทางที่ร้องขอ' })
})

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err)
  res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดภายในระบบเซิร์ฟเวอร์' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})