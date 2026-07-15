import { checkoutPageData } from "../data/checkoutPageData";
import { orderTrackingPageData } from "../data/orderTrackingPageData";

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

function buildSteps(orderStatus = "pending") {
  const steps = [
    {
      label: "รับคำสั่งซื้อ",
      detail: "ระบบได้รับคำสั่งซื้อของคุณแล้ว",
      datetime: "วันนี้",
      icon: "receipt_long",
      status: "received",
    },
    {
      label: "รอตรวจสอบการชำระเงิน",
      detail: "ทีมงานกำลังตรวจสอบหลักฐานการชำระเงิน",
      datetime: "",
      icon: "payments",
      status: "payment",
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
      paid: 2,
      packing: 2,
      shipped: 3,
      delivered: 4,
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

  const order = {
    brand: "UDEE",
    title: "ติดตามคำสั่งซื้อ",
    orderNumber,
    orderDate: getThaiOrderDate(),

    status: "pending",
    statusTag: "รอตรวจสอบชำระเงิน",

    shippingInfo: {
      name: shippingInfo.name || "",
      phone: shippingInfo.phone || "",
      address: shippingInfo.address || "",
      city: shippingInfo.city || "",
      district: shippingInfo.district || "",
      zip: shippingInfo.zip || "",
    },

    paymentInfo: {
      transferDate: paymentInfo.transferDate || "",
      amount: paymentInfo.amount || "",
      slipName: paymentInfo.slip?.name || "",
    },

    steps: buildSteps("pending"),

    items: mapOrderItems(checkout.products || []),

    totals: {
      subtotal: formatPrice(subtotal),
      shipping: shipping === 0 ? "ฟรี" : formatPrice(shipping),
      discount: `-${formatPrice(discount)}`,
      total: formatPrice(total),
    },

    note: "หลังจากตรวจสอบการชำระเงินแล้ว สถานะจะอัปเดตเป็นเตรียมจัดส่ง สามารถใช้เลขคำสั่งซื้อนี้เพื่อติดตามสินค้าได้",
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
