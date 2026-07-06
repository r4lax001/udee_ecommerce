import { checkoutPageData } from '../data/checkoutPageData'
import { orderTrackingPageData } from '../data/orderTrackingPageData'

const STORAGE_KEY = 'udee_orders'

const formatPrice = (value) => `฿${Number(value).toLocaleString('th-TH')}`

function readOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

function createOrderNumber() {
  const date = new Date()
  const dateCode = date.toISOString().slice(2, 10).replaceAll('-', '')
  const randomCode = Math.floor(100 + Math.random() * 900)

  return `UDEE-${dateCode}-${randomCode}`
}

function getThaiOrderDate(date = new Date()) {
  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function buildSteps(orderStatus = 'pending') {
  const steps = [
    {
      label: 'รับคำสั่งซื้อ',
      detail: 'ระบบได้รับคำสั่งซื้อของคุณแล้ว',
      datetime: 'วันนี้',
      icon: 'receipt_long',
      status: 'received',
    },
    {
      label: 'รอตรวจสอบการชำระเงิน',
      detail: 'ทีมงานกำลังตรวจสอบหลักฐานการชำระเงิน',
      datetime: '',
      icon: 'payments',
      status: 'payment',
    },
    {
      label: 'กำลังเตรียมสินค้า',
      detail: 'จัดเตรียมและแพ็กสินค้าเพื่อส่งมอบ',
      datetime: '',
      icon: 'inventory_2',
      status: 'packing',
    },
    {
      label: 'กำลังจัดส่ง',
      detail: 'พัสดุออกจากคลังสินค้าแล้ว',
      datetime: '',
      icon: 'local_shipping',
      status: 'shipping',
    },
    {
      label: 'จัดส่งสำเร็จ',
      detail: 'ขอบคุณที่เลือกซื้อสินค้ากับ UDEE',
      datetime: '',
      icon: 'home_pin',
      status: 'delivered',
    },
  ]

  const statusIndex = {
    pending: 1,
    paid: 2,
    packing: 2,
    shipped: 3,
    delivered: 4,
  }[orderStatus] ?? 1

  return steps.map((step, index) => ({
    ...step,
    completed: index < statusIndex,
    active: index === statusIndex,
  }))
}

export function createOrder({ shippingInfo, paymentInfo, checkout = checkoutPageData }) {
  const subtotal = checkout.totals.subtotal
  const discount = checkout.totals.discount
  const shipping = checkout.totals.shipping
  const total = subtotal - discount + shipping
  const orderNumber = createOrderNumber()

  const order = {
    brand: 'UDEE',
    title: 'ติดตามคำสั่งซื้อ',
    orderNumber,
    orderDate: getThaiOrderDate(),
    status: 'pending',
    statusTag: 'รอตรวจสอบชำระเงิน',

    shippingInfo,

    paymentInfo: {
      transferDate: paymentInfo.transferDate,
      amount: paymentInfo.amount,
      slipName: paymentInfo.slip?.name || '',
    },

    steps: buildSteps('pending'),

    items: checkout.products.map((product) => ({
      title: product.name,
      qty: product.qty,
      price: product.price,
      image: product.image,
    })),

    totals: {
      subtotal: formatPrice(subtotal),
      shipping: shipping === 0 ? 'ฟรี' : formatPrice(shipping),
      discount: `-${formatPrice(discount)}`,
      total: formatPrice(total),
    },

    note: 'หลังจากตรวจสอบการชำระเงินแล้ว สถานะจะอัปเดตเป็นเตรียมจัดส่ง สามารถใช้เลขคำสั่งซื้อนี้เพื่อติดตามสินค้าได้',
  }

  const orders = readOrders()
  saveOrders([order, ...orders])

  return order
}

export function getOrderByNumber(orderNumber) {
  if (!orderNumber) return orderTrackingPageData

  const cleanNumber = orderNumber.replace('#', '')
  const orders = readOrders()

  const found = orders.find(
    (order) => order.orderNumber.replace('#', '') === cleanNumber,
  )

  return found || orderTrackingPageData
}

export function getLatestOrder() {
  return readOrders()[0] || orderTrackingPageData
}