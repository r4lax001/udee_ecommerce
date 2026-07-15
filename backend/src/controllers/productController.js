import prisma from '../db.js'

// GET /api/products - ดูรายชื่อสินค้า
export async function getProducts(req, res) {
  try {
    const { categoryId } = req.query
    const products = await prisma.product.findMany({
      where: categoryId ? { categoryId: parseInt(categoryId) } : {},
      include: {
        category: true,
        images: true
      },
      orderBy: { id: 'desc' }
    })
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET /api/products/:id - ดูรายละเอียดสินค้า
export async function getProductById(req, res) {
  try {
    const { id } = req.params
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        images: true
      }
    })
    if (!product) {
      return res.status(404).json({ error: 'ไม่พบสินค้า' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /api/products - เพิ่มสินค้า
export async function createProduct(req, res) {
  try {
    const { name, description, price, stock, categoryId, imageUrl } = req.body
    
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryId: parseInt(categoryId),
        images: imageUrl ? {
          create: { imageUrl }
        } : undefined
      },
      include: {
        category: true,
        images: true
      }
    })
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// PUT /api/products/:id - แก้ไขสินค้า
export async function updateProduct(req, res) {
  try {
    const { id } = req.params
    const { name, description, price, stock, categoryId, imageUrl } = req.body
    
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined,
        price: price ? parseFloat(price) : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        categoryId: categoryId ? parseInt(categoryId) : undefined
      },
      include: {
        category: true,
        images: true
      }
    })
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// DELETE /api/products/:id - ลบสินค้า
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params
    await prisma.product.delete({
      where: { id: parseInt(id) }
    })
    res.json({ message: 'ลบสินค้าเรียบร้อย' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
