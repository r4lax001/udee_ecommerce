import api from './api'
import { productCards } from '../data/productListPageData'
import { productDetailPageData } from '../data/productDetailPageData'

const USE_MOCK = true

function buildMockProductDetail(product) {
  return {
    ...product,
    name: product.name || product.title || 'สินค้าใหม่',
    description:
      product.description ||
      `${product.title} เพิ่มความเป็นระเบียบให้กับพื้นที่ของคุณ! ถูกออกแบบมาให้เหมาะกับทุกสไตล์การตกแต่ง ทั้งที่บ้านและสำนักงาน ด้วยวัสดุที่ทนทานและให้ความรู้สึกอบอุ่น รองรับทุกความต้องการในการจัดเก็บของคุณ มีชั้นวางภายในที่สามารถปรับเปลี่ยนได้ตามต้องการ สร้างบรรยากาศใหม่ให้กับการทำงานหรือการใช้ชีวิตประจำวันที่ดีกว่า!`,
    gallery:
      product.gallery?.length > 0
        ? product.gallery
        : [
            product.image,
            product.image,
            product.image,
          ],
    variants: product.variants || ['80cm'],
    colors: product.colors || ['#3D2B1F', '#A0764B', '#E7D6C6'],
    materialOptions:
      product.materialOptions ||
      (Array.isArray(product.material) 
        ? product.material 
        : (product.material ? [product.material] : ['สีดาร์คโอ๊ค', 'สีพรีเมียร์โอ๊ค'])),
    specs:
      product.specs || product.generalProperties ||
      [
        'โครงสร้างแข็งแรง รองรับการใช้งานทุกวัน',
        'ผิวไม้เคลือบป้องกันรอยและคราบน้ำ',
        'ประกอบง่าย พร้อมคู่มือภาษาไทย',
        'ออกแบบมาเพื่อความคงทนและความสวยงาม',
      ],
    code: product.code || `UDE-TBL-${String(product.id).padStart(3, '0')}`,
    model: product.model || product.title,
    size: product.size || '120 x 80 ซม.',
    color: product.color || product.colors?.[0] || 'ดาร์ควอลนัต',
    status: product.status || (product.stock > 0 ? 'มีสินค้า' : 'สินค้าหมด'),
    stock: product.stock ?? 0,
    highlights:
      product.highlights ||
      [
        { icon: 'bolt', text: 'โครงสร้างแข็งแรง' },
        { icon: 'star', text: 'ดีไซน์ทันสมัย' },
        { icon: 'water_drop', text: 'ป้องกันคราบและรอยขีดข่วน' },
      ],
    warranty: product.warranty || 'รับประกัน 1 ปี ตามเงื่อนไขของบริษัท',
  }
}

export async function getProducts() {
  if (!USE_MOCK) {
    const response = await api.get('/products')
    return response.data
  }

  return productCards
}

export async function getProductById(id) {
  if (!USE_MOCK) {
    const response = await api.get(`/products/${id}`)
    return response.data
  }

  const numericId = Number(id)
  const product = productCards.find((item) => item.id === numericId)
  if (product) {
    return buildMockProductDetail(product)
  }

  return productDetailPageData.id === numericId ? productDetailPageData : null
}
