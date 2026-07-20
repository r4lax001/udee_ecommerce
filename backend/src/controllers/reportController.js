import prisma from '../db.js'

// GET /api/reports/sales - รายงานยอดขาย
export async function getSalesReport(req, res) {
  try {
    const { period = 'monthly' } = req.query
    const now = new Date()
    let startDate

    if (period === 'daily') {
      startDate = new Date(now); startDate.setDate(startDate.getDate() - 7)
    } else if (period === 'weekly') {
      startDate = new Date(now); startDate.setDate(startDate.getDate() - 28)
    } else {
      startDate = new Date(now.getFullYear(), 0, 1)
    }

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { not: 'CANCELLED' }
      },
      select: {
        total: true,
        createdAt: true,
        status: true
      }
    })

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0)
    const totalOrders = orders.length
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    res.json({
      period,
      totalRevenue,
      totalOrders,
      avgOrderValue,
      orders
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET /api/reports/customers - รายงานลูกค้า
export async function getCustomerReport(req, res) {
  try {
    const totalCustomers = await prisma.user.count({
      where: { role: 'CUSTOMER' }
    })

    const newCustomersThisMonth = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    })

    const topCustomers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      include: {
        orders: {
          select: { total: true }
        }
      },
      take: 10
    })

    const customersWithSpending = topCustomers.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      totalSpent: c.orders.reduce((sum, o) => sum + Number(o.total), 0),
      orderCount: c.orders.length
    })).sort((a, b) => b.totalSpent - a.totalSpent)

    res.json({
      totalCustomers,
      newCustomersThisMonth,
      topCustomers: customersWithSpending
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET /api/reports/products - รายงานสินค้า
export async function getProductReport(req, res) {
  try {
    const totalProducts = await prisma.product.count()
    
    const lowStock = await prisma.product.count({
      where: { stock: { lte: 5 } }
    })

    const outOfStock = await prisma.product.count({
      where: { stock: 0 }
    })

    const products = await prisma.product.findMany({
      include: {
        orderItems: {
          select: { quantity: true, price: true }
        },
        category: {
          select: { name: true }
        }
      }
    })

    const productStats = products.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category.name,
      price: Number(p.price),
      stock: p.stock,
      totalSold: p.orderItems.reduce((sum, oi) => sum + oi.quantity, 0),
      revenue: p.orderItems.reduce((sum, oi) => sum + (Number(oi.price) * oi.quantity), 0)
    })).sort((a, b) => b.totalSold - a.totalSold)

    res.json({
      totalProducts,
      lowStock,
      outOfStock,
      topProducts: productStats.slice(0, 10),
      worstProducts: productStats.slice(-10).reverse()
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET /api/reports/orders - รายงานออเดอร์
export async function getOrderReport(req, res) {
  try {
    const { status } = req.query
    
    const where = status ? { status } : {}
    
    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: { name: true, email: true }
        },
        items: {
          include: {
            product: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const statusCounts = await prisma.order.groupBy({
      by: ['status'],
      _count: true
    })

    const totalRevenue = orders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + Number(o.total), 0)

    res.json({
      totalOrders: orders.length,
      totalRevenue,
      statusBreakdown: statusCounts,
      orders
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
