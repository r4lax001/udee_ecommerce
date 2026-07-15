export const adminDashboardPageData = {
  metrics: [
    { label: 'รายได้วันนี้', value: '฿42,800', change: '+16%' },
    { label: 'ยอดออเดอร์', value: '124', change: '+8%' },
    { label: 'ลูกค้าใหม่', value: '48', change: '+12%' },
    { label: 'สินค้าคงเหลือ', value: '1,234', change: '-4%' },
  ],
  highlights: [
    { title: 'ยอดขายสูงสุด', value: 'โต๊ะ Walnut Classic', badge: '฿15,200' },
    { title: 'สินค้าขายดี', value: 'เก้าอี้สุขุม', badge: '76 ชิ้น' },
    { title: 'สินค้าค้างสต็อก', value: 'โคมไฟตั้งพื้น', badge: '8 ชิ้น' },
  ],
  notifications: [
    { title: 'คำสั่งซื้อใหม่ 25 รายการ', description: 'มีคำสั่งซื้อเข้ามาใหม่วันนี้ ให้ตรวจสอบและจัดส่ง', time: '1 ชั่วโมงที่แล้ว' },
    { title: 'สต็อกสินค้าใกล้หมด', description: 'โคมไฟและโต๊ะทานอาหารบางรายการจำนวนเหลือน้อย', time: '3 ชั่วโมงที่แล้ว' },
  ],
  recentOrders: [
    { id: 'ORD-1024', customer: 'คุณณัฐชา', status: 'รอจัดส่ง' },
    { id: 'ORD-1037', customer: 'คุณปกรณ์', status: 'ตรวจสอบการชำระเงิน' },
    { id: 'ORD-1045', customer: 'คุณอรณภา', status: 'จัดส่งแล้ว' },
  ],
}
