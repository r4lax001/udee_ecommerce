export const orderTrackingPageData = {
  brand: 'UDEE',
  title: 'ติดตามคำสั่งซื้อ',
  orderNumber: '#UDEE-2025-001',
  orderDate: '15 กุมภาพันธ์ 2025',
  statusTag: 'กำลังจัดส่ง',
  steps: [
    {
      label: 'รับคำสั่งซื้อ',
      detail: 'ระบบได้รับคำสั่งซื้อของคุณแล้ว',
      datetime: '15 ก.พ. 2025 • 09:30 น.',
      completed: true,
      icon: 'check',
    },
    {
      label: 'ชำระเงินสำเร็จ',
      detail: 'ตรวจสอบการชำระเงินเรียบร้อยแล้ว',
      datetime: '15 ก.พ. 2025 • 09:45 น.',
      completed: true,
      icon: 'check',
    },
    {
      label: 'กำลังจัดส่ง',
      detail: 'พัสดุของคุณถูกส่งออกจากคลังสินค้าแล้ว',
      datetime: '16 ก.พ. 2025 • 14:20 น.',
      completed: false,
      icon: 'local_shipping',
      active: true,
    },
    {
      label: 'จัดส่งสำเร็จ',
      detail: 'รอรับสินค้าที่หน้าบ้านของคุณ',
      datetime: '',
      completed: false,
      icon: 'inventory',
    },
  ],
  items: [
    {
      title: 'เก้าอี้ทานอาหารรุ่น Walnut Minimal',
      qty: 2,
      price: '฿12,400',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDqlMeeSj4wr0sQxlJ3C_E2Zbci7fOV-m7R-Y53F8aC73sI4isUaNxSuYCg9U7gFudj-UoPT9EEClr7rx3peiOk2mS-C_aYHcFFn-UEl42oQw4-KyF1nHKFkmYZOJ82p3KLpcfhm6ywb1YN3jmD7MGvxbFaKajoDZOzyRkuGNzIKHeZTxxf_GSFgjBWJGQ5a-wse4oAcyddzwVzNAq5OIt7Uk8fH-CUBCJBoiie_nkhzuYAlzgIFb5ciIbwQoRjZsoH9Sq_inCtgvr-',
    },
    {
      title: 'โต๊ะกาแฟไม้โอ๊คทรงกลม',
      qty: 1,
      price: '฿8,500',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB3hOYhM12XoEsVLg9FnErKYoj6DC8ZH_q8HJ2CkVNI9V6z-8uErvOCxPbYFTMmQ3aP4ElGxKDNpMmbqCnHKiNSu6ekuxv-vCenIsrVBQEE-xnmAFO7xyynHNGuRRaF3HoQ-soCl4PVsinA3zLrEzv3fp1FrwrmJK8n6CTKuzT8QRrbTBQsyN6Qa5fWTa4xbNpKvlPRor6baBBab4wWTno9q88_pc-iwfVPNR8XBref_sG_uQPELlnixKLpPTjCOLRuUYIRQqL7_9mB',
    },
  ],
  totals: {
    subtotal: '฿20,900',
    shipping: 'ฟรี',
    discount: '-฿500',
    total: '฿20,400',
  },
  note: 'ราคานี้รวมภาษีมูลค่าเพิ่ม 7% เรียบร้อยแล้ว พร้อมบริการประกอบติดตั้งหน้างาน',
}
