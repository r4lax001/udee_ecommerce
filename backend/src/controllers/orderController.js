import { prisma } from '../lib/prisma.js'

export async function getOrders(req, res) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(orders)
  } catch (err) {
    console.error('[orders] get error:', err)
    res.status(500).json({ error: 'Internal server error', detail: err.message })
  }
}

export async function getOrderById(req, res) {
  try {
    const { id } = req.params
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: {
            product: {
              include: {
                images: true
              }
            }
          }
        }
      }
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json(order)
  } catch (err) {
    console.error('[orders] getById error:', err)
    res.status(500).json({ error: 'Internal server error', detail: err.message })
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id, 10) },
      data: { status },
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { items: true } },
      }
    })

    res.json(order)
  } catch (err) {
    console.error('[orders] updateStatus error:', err)
    res.status(500).json({ error: 'Internal server error', detail: err.message })
  }
}
