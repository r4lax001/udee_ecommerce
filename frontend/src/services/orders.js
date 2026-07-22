import api from "./api";
import { checkoutPageData } from "../data/checkoutPageData";
import { orderTrackingPageData } from "../data/orderTrackingPageData";

/**
 * ดึงออเดอร์ทั้งหมดของ user ที่ login อยู่ จาก backend API
 */
export const getMyOrders = async () => {
  const response = await api.get("/orders/my");
  return response.data;
};

const STORAGE_KEY = "udee_orders";

const formatPrice = (value) => {
  const numberValue = Number(String(value).replace(/[^\d.-]/g, "")) || 0;
  return `฿${numberValue.toLocaleString("th-TH")}`;
};

const getNumber = (value) => {
  if (typeof value === "number") return value;
  return Number(String(value).replace(/[^\d.-]/g, "")) || 0;
};

function readOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function createOrderNumber() {
  const date = new Date();
  const dateCode = date.toISOString().slice(2, 10).replaceAll("-", "");
  const randomCode = Math.floor(100 + Math.random() * 900);

  return `UDEE-${dateCode}-${randomCode}`;
}

function getThaiOrderDate(date = new Date()) {
  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getPaymentStatusText(status) {
  const statusMap = {
    pending_review: "รอตรวจสอบโดยผู้จัดการ",
    qr_not_found: "ไม่พบ QR Code ในสลิป",
    qr_read_error: "อ่าน QR Code ไม่สำเร็จ",
    approved: "ชำระเงินสำเร็จ",
    rejected: "สลิปไม่ถูกต้อง",
  };

  return statusMap[status] || "รอตรวจสอบโดยผู้จัดการ";
}

function buildSteps(orderStatus = "pending_payment") {
  const steps = [
    {
      label: "รับคำสั่งซื้อ",
      detail: "ระบบได้รับคำสั่งซื้อของคุณแล้ว",
      datetime: "วันนี้",
      icon: "receipt_long",
      status: "received",
    },
    {
      label: "รอตรวจสอบสลิป",
      detail: "ระบบอ่าน QR จากสลิปแล้ว และรอผู้จัดการตรวจสอบการชำระเงิน",
      datetime: "",
      icon: "qr_code_scanner",
      status: "payment",
    },
    {
      label: "ชำระเงินสำเร็จ",
      detail: "ผู้จัดการตรวจสอบและอนุมัติการชำระเงินแล้ว",
      datetime: "",
      icon: "payments",
      status: "paid",
    },
    {
      label: "กำลังเตรียมสินค้า",
      detail: "จัดเตรียมและแพ็กสินค้าเพื่อส่งมอบ",
      datetime: "",
      icon: "inventory_2",
      status: "packing",
    },
    {
      label: "กำลังจัดส่ง",
      detail: "พัสดุออกจากคลังสินค้าแล้ว",
      datetime: "",
      icon: "local_shipping",
      status: "shipping",
    },
    {
      label: "จัดส่งสำเร็จ",
      detail: "ขอบคุณที่เลือกซื้อสินค้ากับ UDEE",
      datetime: "",
      icon: "home_pin",
      status: "delivered",
    },
  ];

  const statusIndex =
    {
      pending: 1,
      pending_payment: 1,
      paid: 2,
      packing: 3,
      shipped: 4,
      delivered: 5,
      rejected: 1,
    }[orderStatus] ?? 1;

  return steps.map((step, index) => ({
    ...step,
    completed: index < statusIndex,
    active: index === statusIndex,
  }));
}

function mapOrderItems(products = []) {
  return products.map((product) => {
    const unitPrice = getNumber(product.price);
    const qty = Number(product.qty) || 1;
    const itemTotal = unitPrice * qty;

    return {
      title: product.name || product.title || "สินค้า",
      qty,
      price: formatPrice(itemTotal),
      unitPrice: formatPrice(unitPrice),
      image: product.image || "",
      variant: product.variant || "Standard",
      color: product.color || "",
      material: product.material || "",
    };
  });
}

export function createOrder({
  shippingInfo,
  paymentInfo,
  checkout = checkoutPageData,
}) {
  const subtotal = getNumber(checkout.totals?.subtotal);
  const discount = getNumber(checkout.totals?.discount);
  const shipping = getNumber(checkout.totals?.shipping);
  const total = subtotal - discount + shipping;

  const orderNumber = createOrderNumber();
  const paymentVerifyStatus = paymentInfo.verifyStatus || "pending_review";

  const order = {
    brand: "UDEE",
    title: "ติดตามคำสั่งซื้อ",
    orderNumber,
    orderDate: getThaiOrderDate(),

    status: "pending_payment",
    statusTag: "รอตรวจสอบสลิป",

    shippingInfo: {
      name: shippingInfo.name || "",
      phone: shippingInfo.phone || "",
      address: shippingInfo.address || "",
      city: shippingInfo.city || "",
      district: shippingInfo.district || "",
      zip: shippingInfo.zip || "",
    },

    paymentInfo: {
      method: "bank_transfer",
      bankName: "ธนาคารกสิกรไทย (K-Bank)",
      accountName: "บจก. ยูดี เฟอร์นิเจอร์ (UDEE Furniture)",
      accountNumber: "123-4-56789-0",

      transferDate: paymentInfo.transferDate || "",
      amount: paymentInfo.amount || "",
      slipName: paymentInfo.slipName || paymentInfo.slip?.name || "",
      slipPreview: paymentInfo.slipPreview || "",

      qrPayload: paymentInfo.qrPayload || "",
      qrStatus: paymentInfo.qrStatus || "idle",
      qrMessage: paymentInfo.qrMessage || "",
      verifyStatus: paymentVerifyStatus,
      verifyStatusText: getPaymentStatusText(paymentVerifyStatus),
    },

    steps: buildSteps("pending_payment"),

    items: mapOrderItems(checkout.products || []),

    totals: {
      subtotal: formatPrice(subtotal),
      shipping: shipping === 0 ? "ฟรี" : formatPrice(shipping),
      discount: `-${formatPrice(discount)}`,
      total: formatPrice(total),
    },

    note: "ระบบอ่าน QR Code จากสลิปแล้ว และคำสั่งซื้ออยู่ระหว่างรอผู้จัดการตรวจสอบการชำระเงิน สามารถใช้เลขคำสั่งซื้อนี้เพื่อติดตามสถานะได้",
  };

  const orders = readOrders();
  saveOrders([order, ...orders]);

  return order;
}

export function getOrderByNumber(orderNumber) {
  if (!orderNumber) return orderTrackingPageData;

  const cleanNumber = orderNumber.trim().replace("#", "");
  const orders = readOrders();

  const found = orders.find(
    (order) => order.orderNumber.replace("#", "") === cleanNumber,
  );

  return found || orderTrackingPageData;
}

export function getLatestOrder() {
  return readOrders()[0] || orderTrackingPageData;
}

export function getLocalOrders() {
  return readOrders();
}

export function updateOrderPaymentStatus(orderNumber, nextPaymentStatus) {
  const orders = readOrders();

  const nextOrders = orders.map((order) => {
    if (order.orderNumber !== orderNumber) return order;

    const nextOrderStatus =
      nextPaymentStatus === "approved"
        ? "paid"
        : nextPaymentStatus === "rejected"
          ? "rejected"
          : "pending_payment";

    return {
      ...order,
      status: nextOrderStatus,
      statusTag:
        nextPaymentStatus === "approved"
          ? "ชำระเงินสำเร็จ"
          : nextPaymentStatus === "rejected"
            ? "สลิปไม่ถูกต้อง"
            : "รอตรวจสอบสลิป",
      paymentInfo: {
        ...order.paymentInfo,
        verifyStatus: nextPaymentStatus,
        verifyStatusText: getPaymentStatusText(nextPaymentStatus),
      },
      steps: buildSteps(nextOrderStatus),
    };
  });

  saveOrders(nextOrders);

  return nextOrders.find((order) => order.orderNumber === orderNumber);
}

export function updateOrderStatus(orderNumber, nextStatus) {
  const orders = readOrders();

  const statusTagMap = {
    pending_payment: "รอตรวจสอบสลิป",
    paid: "ชำระเงินสำเร็จ",
    packing: "กำลังเตรียมสินค้า",
    shipped: "กำลังจัดส่ง",
    delivered: "จัดส่งสำเร็จ",
    rejected: "สลิปไม่ถูกต้อง",
  };

  const nextOrders = orders.map((order) => {
    if (order.orderNumber !== orderNumber) return order;

    return {
      ...order,
      status: nextStatus,
      statusTag: statusTagMap[nextStatus] || "รอตรวจสอบสลิป",
      steps: buildSteps(nextStatus),
    };
  });

  saveOrders(nextOrders);

  return nextOrders.find((order) => order.orderNumber === orderNumber);
}
