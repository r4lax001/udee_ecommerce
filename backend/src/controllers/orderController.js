import prisma from '../db.js'

// GET /api/orders - ดูออเดอร์ทั้งหมด
export async function getOrders(req, res) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        items: {
          include: {
            product: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET /api/orders/:id - ดูรายละเอียดออเดอร์
export async function getOrderById(req, res) {
  try {
    const { id } = req.params
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        items: {
          include: {
            product: {
              select: { id: true, name: true, price: true }
            }
          }
        }
      }
    })
    if (!order) {
      return res.status(404).json({ error: 'ไม่พบออเดอร์' })
    }
    res.json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /api/orders - สร้างออเดอร์
export async function createOrder(req, res) {
  try {
    const { userId, items, shippingAddress } = req.body
    
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'กรุณาระบุ userId และ items' })
    }

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const order = await prisma.order.create({
      data: {
        userId: parseInt(userId),
        total,
        shippingAddress,
        status: 'PENDING',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// PUT /api/orders/:id/status - เปลี่ยนสถานะออเดอร์
export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ error: 'กรุณาระบุ status' })
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status }
    })

    res.json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
