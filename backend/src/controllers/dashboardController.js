import prisma from '../db.js'

const STATUS_MAP = {
  PENDING: 'Pending',
  WAITING_FOR_PAYMENT: 'Waiting for Payment',
  PAID: 'Paid',
  SHIPPED: 'Shipped',
  DELIVERED: 'Completed',
  CANCELLED: 'Cancelled',
}

function relativeTime(date) {
  const now = new Date()
  const diff = now - new Date(date)
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 60) return `${mins} นาทีที่แล้ว`
  if (hrs < 24) return `${hrs} ชม. ที่แล้ว`
  if (days === 1) return `วานนี้`
  return `${days} วันที่แล้ว`
}

function pctChange(current, previous) {
  if (previous === 0) return current > 0 ? '+100%' : '0%'
  const pct = ((current - previous) / previous * 100).toFixed(0)
  return pct >= 0 ? `+${pct}%` : `${pct}%`
}

export async function getDashboardStats(req, res) {
  try {
    const now = new Date()
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999)

    const yestStart = new Date(todayStart); yestStart.setDate(yestStart.getDate() - 1)
    const yestEnd = new Date(todayEnd); yestEnd.setDate(yestEnd.getDate() - 1)

    const year = now.getFullYear()
    const yearStart = new Date(year, 0, 1)
    const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999)

    const [
      todayOrders,
      yestOrders,
      todayNewCustomers,
      yestNewCustomers,
      totalStockAgg,
      monthlyOrders,
      recentOrders,
      topProducts,
      newOrdersCount,
      lowStockProducts,
      newCustomersTodayCount,
    ] = await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: todayStart, lte: todayEnd }, status: { not: 'CANCELLED' } },
        select: { total: true },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: yestStart, lte: yestEnd }, status: { not: 'CANCELLED' } },
        select: { total: true },
      }),
      prisma.user.count({
        where: { role: 'CUSTOMER', createdAt: { gte: todayStart, lte: todayEnd } },
      }),
      prisma.user.count({
        where: { role: 'CUSTOMER', createdAt: { gte: yestStart, lte: yestEnd } },
      }),
      prisma.product.aggregate({ _sum: { stock: true } }),
      prisma.order.findMany({
        where: { createdAt: { gte: yearStart, lte: yearEnd }, status: { not: 'CANCELLED' } },
        select: { total: true, createdAt: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          total: true,
          status: true,
          createdAt: true,
          user: { select: { name: true } },
        },
      }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true, price: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 4,
      }),
      prisma.order.count({
        where: { createdAt: { gte: todayStart, lte: todayEnd }, status: 'PENDING' },
      }),
      prisma.product.findMany({
        where: { stock: { lte: 5 } },
        select: { id: true, name: true, stock: true },
        take: 5,
        orderBy: { stock: 'asc' },
      }),
      prisma.user.count({
        where: { role: 'CUSTOMER', createdAt: { gte: todayStart, lte: todayEnd } },
      }),
    ])

    const revenueToday = todayOrders.reduce((sum, o) => sum + Number(o.total), 0)
    const revenueYest = yestOrders.reduce((sum, o) => sum + Number(o.total), 0)
    const ordersToday = todayOrders.length
    const ordersYest = yestOrders.length
    const totalStock = totalStockAgg._sum.stock ?? 0

    const monthlySales = Array(12).fill(0)
    for (const order of monthlyOrders) {
      const month = new Date(order.createdAt).getMonth()
      monthlySales[month] += Number(order.total)
    }

    const recentOrdersFormatted = recentOrders.map((o) => ({
      id: `ORD-${String(o.id).padStart(3, '0')}`,
      customer: o.user?.name ?? 'ไม่ระบุ',
      amount: `฿${Number(o.total).toLocaleString('th-TH')}`,
      status: STATUS_MAP[o.status] ?? o.status,
      date: relativeTime(o.createdAt),
    }))

    const productIds = topProducts.map((tp) => tp.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        images: { select: { imageUrl: true }, take: 1 },
      },
    })
    const productMap = Object.fromEntries(products.map((p) => [p.id, p]))

    const topProductsFormatted = topProducts.map((tp) => {
      const prod = productMap[tp.productId]
      return {
        name: prod?.name ?? 'ไม่ระบุ',
        sales: tp._sum.quantity ?? 0,
        revenue: `฿${Number(tp._sum.price ?? 0).toLocaleString('th-TH')}`,
        image: prod?.images?.[0]?.imageUrl ?? null,
      }
    })

    const notifications = []

    if (newOrdersCount > 0) {
      notifications.push({
        icon: 'shopping_cart',
        title: `คำสั่งซื้อใหม่ ${newOrdersCount} รายการวันนี้`,
        time: 'วันนี้',
        urgent: false,
      })
    }
    if (lowStockProducts.length > 0) {
      notifications.push({
        icon: 'warning',
        title: `สินค้าใกล้หมด ${lowStockProducts.length} รายการ (stock ≤ 5)`,
        time: 'ตรวจสอบด่วน',
        urgent: true,
        detail: lowStockProducts,
      })
    }
    if (newCustomersTodayCount > 0) {
      notifications.push({
        icon: 'person_add',
        title: `ลูกค้าใหม่ ${newCustomersTodayCount} คนวันนี้`,
        time: 'วันนี้',
        urgent: false,
      })
    }

    res.json({
      kpi: {
        revenueToday,
        revenueChange: pctChange(revenueToday, revenueYest),
        ordersToday,
        ordersChange: pctChange(ordersToday, ordersYest),
        newCustomers: todayNewCustomers,
        customersChange: pctChange(todayNewCustomers, yestNewCustomers),
        totalStock,
      },
      monthlySales,
      recentOrders: recentOrdersFormatted,
      topProducts: topProductsFormatted,
      notifications,
    })
  } catch (err) {
    console.error('[dashboard] error:', err)
    res.status(500).json({ error: 'Internal server error', detail: err.message })
  }
}
