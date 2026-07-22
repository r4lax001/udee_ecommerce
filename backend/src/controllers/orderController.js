import prisma from '../db.js'

const orderInclude = {
  user: { select: { id: true, name: true, email: true } },
  items: { include: { product: { select: { id: true, name: true, price: true } } } },
}

export async function getOrders(req, res) {
  try {
    const orders = await prisma.order.findMany({ include: orderInclude, orderBy: { createdAt: 'desc' } })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve orders' })
  }
}

export async function getMyOrders(req, res) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: { select: { id: true, name: true, price: true } } } } },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ success: true, orders })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Unable to retrieve orders' })
  }
}

export async function getOrderById(req, res) {
  try {
    const orderId = Number.parseInt(req.params.id, 10)
    if (!Number.isInteger(orderId)) return res.status(400).json({ error: 'Invalid order id' })

    const order = await prisma.order.findUnique({ where: { id: orderId }, include: orderInclude })
    if (!order) return res.status(404).json({ error: 'Order not found' })
    if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'You do not have access to this order' })
    }
    res.json(order)
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve order' })
  }
}

export async function createOrder(req, res) {
  try {
    const { items } = req.body
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one order item is required' })
    }

    const requestedItems = new Map()
    for (const item of items) {
      const productId = Number.parseInt(item.productId, 10)
      const quantity = Number.parseInt(item.quantity, 10)
      if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ error: 'Each item must have a valid productId and quantity' })
      }
      requestedItems.set(productId, (requestedItems.get(productId) || 0) + quantity)
    }

    const order = await prisma.$transaction(async (tx) => {
      const productIds = [...requestedItems.keys()]
      const products = await tx.product.findMany({ where: { id: { in: productIds } } })
      if (products.length !== productIds.length) throw new Error('One or more products were not found')

      const orderItems = products.map((product) => {
        const quantity = requestedItems.get(product.id)
        if (product.stock < quantity) throw new Error(`Insufficient stock for product ${product.id}`)
        return { productId: product.id, quantity, price: product.price }
      })
      const total = orderItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)

      await Promise.all(orderItems.map((item) => tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity }, sold: { increment: item.quantity } },
      })))

      return tx.order.create({
        data: { userId: req.user.id, total, status: 'PENDING', items: { create: orderItems } },
        include: { items: { include: { product: true } } },
      })
    })

    // Emit notifications
    await prisma.notification.createMany({
      data: [
        {
          userId: req.user.id,
          title: `สั่งซื้อสำเร็จ (ออเดอร์ #${order.id})`,
          message: `คำสั่งซื้อของคุณได้รับเข้าระบบเรียบร้อยแล้ว ยอดรวม ฿${order.total.toLocaleString()}`,
          type: 'SUCCESS'
        },
        {
          userId: null,
          role: 'ADMIN',
          title: `มีคำสั่งซื้อใหม่ #${order.id}`,
          message: `ลูกค้าได้ทำการสั่งซื้อสินค้า ยอดรวม ฿${order.total.toLocaleString()}`,
          type: 'INFO'
        },
        {
          userId: null,
          role: 'MANAGER',
          title: `มีคำสั่งซื้อใหม่ #${order.id}`,
          message: `ลูกค้าได้ทำการสั่งซื้อสินค้า ยอดรวม ฿${order.total.toLocaleString()}`,
          type: 'INFO'
        }
      ]
    })

    res.status(201).json(order)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export async function updateOrderStatus(req, res) {
  const allowedStatuses = new Set(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
  try {
    const orderId = Number.parseInt(req.params.id, 10)
    if (!Number.isInteger(orderId) || !allowedStatuses.has(req.body.status)) {
      return res.status(400).json({ error: 'Invalid order id or status' })
    }
    const order = await prisma.order.update({ where: { id: orderId }, data: { status: req.body.status } })
    
    // Notify customer about status change
    await prisma.notification.create({
      data: {
        userId: order.userId,
        title: `อัปเดตสถานะออเดอร์ #${order.id}`,
        message: `คำสั่งซื้อของคุณถูกเปลี่ยนสถานะเป็น ${req.body.status}`,
        type: 'INFO'
      }
    })

    res.json(order)
  } catch (error) {
    res.status(error.code === 'P2025' ? 404 : 500).json({ error: error.code === 'P2025' ? 'Order not found' : 'Unable to update order' })
  }
}
