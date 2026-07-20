import prisma from '../db.js'

// GET /api/addresses/my - ดึงที่อยู่ทั้งหมดของ user ที่ login
export async function getMyAddresses(req, res) {
  try {
    const userId = req.user.id

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { id: 'asc' },
    })

    res.json({ success: true, addresses })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// POST /api/addresses/my - เพิ่มที่อยู่ใหม่สำหรับ user ที่ login
export async function createMyAddress(req, res) {
  try {
    const userId = req.user.id
    const { houseNo, soi, road, subDistrict, district, province, postalCode } = req.body

    if (!houseNo || !subDistrict || !district || !province || !postalCode) {
      return res.status(400).json({ success: false, error: 'กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน' })
    }

    if (!/^\d{5}$/.test(postalCode)) {
      return res.status(400).json({ success: false, error: 'รูปแบบรหัสไปรษณีย์ไม่ถูกต้อง (กรุณากรอก 5 หลัก)' })
    }

    const address = await prisma.address.create({
      data: {
        userId,
        houseNo,
        soi: soi || null,
        road: road || null,
        subDistrict,
        district,
        province,
        postalCode,
      },
    })

    res.status(201).json({ success: true, address })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// GET /api/addresses - ดูที่อยู่ทั้งหมดของ user (admin)
export async function getAddresses(req, res) {
  try {
    const { userId } = req.query
    
    const addresses = await prisma.address.findMany({
      where: userId ? { userId: parseInt(userId) } : {},
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    })
    
    res.json(addresses)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET /api/addresses/:id - ดูที่อยู่ตาม ID
export async function getAddressById(req, res) {
  try {
    const { id } = req.params
    
    const address = await prisma.address.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    
    if (!address) {
      return res.status(404).json({ error: 'ไม่พบที่อยู่' })
    }
    
    res.json(address)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /api/addresses - เพิ่มที่อยู่ใหม่ (admin)
export async function createAddress(req, res) {
  try {
    const { userId, houseNo, soi, road, subDistrict, district, province, postalCode } = req.body
    
    if (!userId || !houseNo || !subDistrict || !district || !province || !postalCode) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' })
    }
    
    const address = await prisma.address.create({
      data: {
        userId: parseInt(userId),
        houseNo,
        soi: soi || null,
        road: road || null,
        subDistrict,
        district,
        province,
        postalCode
      }
    })
    
    res.status(201).json(address)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// PUT /api/addresses/:id - แก้ไขที่อยู่
export async function updateAddress(req, res) {
  try {
    const { id } = req.params
    const { houseNo, soi, road, subDistrict, district, province, postalCode } = req.body

    // ตรวจสอบว่าเป็นที่อยู่ของ user นั้นจริงๆ
    const existing = await prisma.address.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return res.status(404).json({ success: false, error: 'ไม่พบที่อยู่' })
    }
    if (existing.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'ไม่มีสิทธิ์แก้ไขที่อยู่นี้' })
    }

    if (postalCode && !/^\d{5}$/.test(postalCode)) {
      return res.status(400).json({ success: false, error: 'รูปแบบรหัสไปรษณีย์ไม่ถูกต้อง (กรุณากรอก 5 หลัก)' })
    }
    
    const address = await prisma.address.update({
      where: { id: parseInt(id) },
      data: {
        houseNo: houseNo || undefined,
        soi: soi !== undefined ? soi : undefined,
        road: road !== undefined ? road : undefined,
        subDistrict: subDistrict || undefined,
        district: district || undefined,
        province: province || undefined,
        postalCode: postalCode || undefined
      }
    })
    
    res.json({ success: true, address })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'ไม่พบที่อยู่' })
    }
    res.status(500).json({ error: error.message })
  }
}

// DELETE /api/addresses/:id - ลบที่อยู่
export async function deleteAddress(req, res) {
  try {
    const { id } = req.params

    const existing = await prisma.address.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return res.status(404).json({ success: false, error: 'ไม่พบที่อยู่' })
    }
    if (existing.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'ไม่มีสิทธิ์ลบที่อยู่นี้' })
    }
    
    await prisma.address.delete({
      where: { id: parseInt(id) }
    })
    
    res.json({ success: true, message: 'ลบที่อยู่เรียบร้อย' })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'ไม่พบที่อยู่' })
    }
    res.status(500).json({ error: error.message })
  }
}
