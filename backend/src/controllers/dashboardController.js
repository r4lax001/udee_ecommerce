import { prisma } from '../lib/prisma.js'

// ─── Helper: แปลง OrderStatus ของ Prisma → label สำหรับ frontend ──────────────
const STATUS_MAP = {
  PENDING:   'Pending',
  CONFIRMED: 'Processing',
  SHIPPED:   'Shipped',
  DELIVERED: 'Completed',
  CANCELLED: 'Cancelled',
}

// ─── Helper: แปลง Date → relative time string (ภาษาไทย) ────────────────────────
function relativeTime(date) {
  const now = new Date()
  const diff = now - new Date(date)           // ms
  const mins = Math.floor(diff / 60000)
  const hrs  = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 60)  return `${mins} นาทีที่แล้ว`
  if (hrs < 24)   return `${hrs} ชม. ที่แล้ว`
  if (days === 1) return `วานนี้`
  return `${days} วันที่แล้ว`
}

// ─── Helper: คำนวณ % เปลี่ยนแปลงเทียบวันก่อน ────────────────────────────────
function pctChange(current, previous) {
  if (previous === 0) return current > 0 ? '+100%' : '0%'
  const pct = ((current - previous) / previous * 100).toFixed(0)
  return pct >= 0 ? `+${pct}%` : `${pct}%`
}

// ─── GET /api/dashboard ──────────────────────────────────────────────────────
export async function getDashboardStats(req, res) {
  try {
    const now       = new Date()
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0)
    const todayEnd   = new Date(now); todayEnd.setHours(23, 59, 59, 999)

    const yestStart  = new Date(todayStart); yestStart.setDate(yestStart.getDate() - 1)
    const yestEnd    = new Date(todayEnd);   yestEnd.setDate(yestEnd.getDate() - 1)

    const year = now.getFullYear()
    const yearStart = new Date(year, 0, 1)
    const yearEnd   = new Date(year, 11, 31, 23, 59, 59, 999)

    // ── ดึงข้อมูลทั้งหมดพร้อมกัน (parallel) ──────────────────────────────────
    const [
      // KPI วันนี้
      todayOrders,
      yestOrders,
      todayNewCustomers,
      yestNewCustomers,
      totalStockAgg,
      // ยอดขายรายเดือน
      monthlyOrders,
      // ออเดอร์ล่าสุด
      recentOrders,
      // สินค้าขายดี
      topProducts,
      // การแจ้งเตือน
      newOrdersCount,
      lowStockProducts,
      newCustomersTodayCount,
    ] = await Promise.all([
      // --- KPI ---
      // ยอดออเดอร์วันนี้ (ยกเว้น CANCELLED)
      prisma.order.findMany({
        where: { createdAt: { gte: todayStart, lte: todayEnd }, status: { not: 'CANCELLED' } },
        select: { total: true },
      }),
      // ยอดออเดอร์เมื่อวาน
      prisma.order.findMany({
        where: { createdAt: { gte: yestStart,  lte: yestEnd  }, status: { not: 'CANCELLED' } },
        select: { total: true },
      }),
      // ลูกค้าใหม่วันนี้
      prisma.user.count({
        where: { role: 'CUSTOMER', createdAt: { gte: todayStart, lte: todayEnd } },
      }),
      // ลูกค้าใหม่เมื่อวาน
      prisma.user.count({
        where: { role: 'CUSTOMER', createdAt: { gte: yestStart,  lte: yestEnd  } },
      }),
      // รวม stock ทั้งหมด
      prisma.product.aggregate({ _sum: { stock: true } }),

      // --- Chart ---
      // ยอดออเดอร์ทั้งปี group by month
      prisma.order.findMany({
        where: { createdAt: { gte: yearStart, lte: yearEnd }, status: { not: 'CANCELLED' } },
        select: { total: true, createdAt: true },
      }),

      // --- Recent Orders (5 รายการล่าสุด) ---
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

      // --- Top Products (ขายดีสุด 4 รายการ) ---
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true, price: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 4,
      }),

      // --- Notifications ---
      // ออเดอร์ใหม่วันนี้
      prisma.order.count({
        where: { createdAt: { gte: todayStart, lte: todayEnd }, status: 'PENDING' },
      }),
      // สินค้าใกล้หมด (stock <= 5)
      prisma.product.findMany({
        where: { stock: { lte: 5 } },
        select: { id: true, name: true, stock: true },
        take: 5,
        orderBy: { stock: 'asc' },
      }),
      // ลูกค้าใหม่วันนี้
      prisma.user.count({
        where: { role: 'CUSTOMER', createdAt: { gte: todayStart, lte: todayEnd } },
      }),
    ])

    // ── คำนวณ KPI ─────────────────────────────────────────────────────────────
    const revenueToday  = todayOrders.reduce((sum, o) => sum + Number(o.total), 0)
    const revenueYest   = yestOrders.reduce((sum, o)  => sum + Number(o.total), 0)
    const ordersToday   = todayOrders.length
    const ordersYest    = yestOrders.length
    const totalStock    = totalStockAgg._sum.stock ?? 0

    // ── ยอดขายรายเดือน (12 เดือน) ─────────────────────────────────────────────
    const monthlySales = Array(12).fill(0)
    for (const order of monthlyOrders) {
      const month = new Date(order.createdAt).getMonth() // 0-11
      monthlySales[month] += Number(order.total)
    }

    // ── ออเดอร์ล่าสุด ─────────────────────────────────────────────────────────
    const recentOrdersFormatted = recentOrders.map((o) => ({
      id:       `ORD-${String(o.id).padStart(3, '0')}`,
      customer: o.user?.name ?? 'ไม่ระบุ',
      amount:   `฿${Number(o.total).toLocaleString('th-TH')}`,
      status:   STATUS_MAP[o.status] ?? o.status,
      date:     relativeTime(o.createdAt),
    }))

    // ── Top Products — ดึง product info ────────────────────────────────────────
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
        name:    prod?.name ?? 'ไม่ระบุ',
        sales:   tp._sum.quantity ?? 0,
        revenue: `฿${Number(tp._sum.price ?? 0).toLocaleString('th-TH')}`,
        image:   prod?.images?.[0]?.imageUrl ?? null,
      }
    })

    // ── Notifications ─────────────────────────────────────────────────────────
    const notifications = []

    if (newOrdersCount > 0) {
      notifications.push({
        icon:   'shopping_cart',
        title:  `คำสั่งซื้อใหม่ ${newOrdersCount} รายการวันนี้`,
        time:   'วันนี้',
        urgent: false,
      })
    }
    if (lowStockProducts.length > 0) {
      notifications.push({
        icon:   'warning',
        title:  `สินค้าใกล้หมด ${lowStockProducts.length} รายการ (stock ≤ 5)`,
        time:   'ตรวจสอบด่วน',
        urgent: true,
        detail: lowStockProducts,
      })
    }
    if (newCustomersTodayCount > 0) {
      notifications.push({
        icon:   'person_add',
        title:  `ลูกค้าใหม่ ${newCustomersTodayCount} คนวันนี้`,
        time:   'วันนี้',
        urgent: false,
      })
    }

    // ── Response ───────────────────────────────────────────────────────────────
    res.json({
      kpi: {
        revenueToday,
        revenueChange:  pctChange(revenueToday, revenueYest),
        ordersToday,
        ordersChange:   pctChange(ordersToday, ordersYest),
        newCustomers:   todayNewCustomers,
        customersChange: pctChange(todayNewCustomers, yestNewCustomers),
        totalStock,
      },
      monthlySales,   // [0..11] ยอดขาย (บาท) แต่ละเดือน
      recentOrders:   recentOrdersFormatted,
      topProducts:    topProductsFormatted,
      notifications,
    })
  } catch (err) {
    console.error('[dashboard] error:', err)
    res.status(500).json({ error: 'Internal server error', detail: err.message })
  }
}
