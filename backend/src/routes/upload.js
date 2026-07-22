import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { requireAuth, adminOrManager } from '../middlewares/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadDir = path.join(__dirname, '../../public/uploads')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `img-${uniqueSuffix}${ext}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = new Set(['image/avif', 'image/webp', 'image/png', 'image/jpeg', 'image/gif'])
  const ext = path.extname(file.originalname).toLowerCase()
  const allowedExts = new Set(['.avif', '.webp', '.png', '.jpg', '.jpeg', '.gif'])
  if (allowedExts.has(ext) && allowedTypes.has(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('รองรับเฉพาะไฟล์รูปภาพ (.avif, .webp, .png, .jpg, .jpeg, .gif, .svg) เท่านั้น'), false)
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
})

const router = Router()

router.post('/', requireAuth, adminOrManager, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'กรุณาเลือกไฟล์รูปภาพ' })
    }
    const relativeUrl = `/uploads/${req.file.filename}`
    return res.status(200).json({
      success: true,
      url: relativeUrl,
      filename: req.file.filename
    })
  } catch (error) {
    console.error('Upload Error:', error)
    return res.status(500).json({ success: false, message: error.message || 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์' })
  }
})

export default router
