import express from 'express'
import cors from 'cors'
<<<<<<< HEAD
import dotenv from 'dotenv'
=======
import helmet from 'helmet'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
>>>>>>> auth-system

dotenv.config()

const app = express()

<<<<<<< HEAD
app.use(cors())
app.use(express.json())

=======
// ──────────────────────────────────────────────
// Security Headers (helmet)
// ──────────────────────────────────────────────
app.use(helmet())

// ──────────────────────────────────────────────
// CORS – อนุญาตเฉพาะ Origin ที่กำหนด
// ──────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map(o => o.trim())

app.use(cors({
  origin: (origin, callback) => {
    // อนุญาต request ที่ไม่มี Origin (เช่น curl / Postman)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error(`CORS: Origin "${origin}" is not allowed`), false)
  },
  credentials: true,
}))

app.use(express.json({ limit: '10kb' })) // จำกัดขนาด body ป้องกัน DoS

// ──────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)

// Health check
>>>>>>> auth-system
app.get('/', (req, res) => {
  res.json({ message: 'Udee API is running' })
})

<<<<<<< HEAD
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
=======
// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'ไม่พบเส้นทางที่ร้องขอ' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err)
  res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดภายในระบบเซิร์ฟเวอร์' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
>>>>>>> auth-system
})