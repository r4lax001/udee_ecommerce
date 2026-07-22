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
    const { name, description, price, stock, categoryId, imageUrl, images, subtitle, badge, details, sold, rating, reviews } = req.body
    
    let imageCreateList = []
    if (Array.isArray(images) && images.length > 0) {
      imageCreateList = images.map(img => {
        if (typeof img === 'string') return { imageUrl: img }
        if (img && typeof img === 'object' && img.imageUrl) return { imageUrl: img.imageUrl }
        return null
      }).filter(Boolean)
    } else if (typeof imageUrl === 'string' && imageUrl.trim()) {
      imageCreateList = [{ imageUrl: imageUrl.trim() }]
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryId: parseInt(categoryId),
        subtitle: subtitle || undefined,
        badge: badge || undefined,
        details: details || undefined,
        sold: sold ? parseInt(sold) : undefined,
        rating: rating ? String(rating) : undefined,
        reviews: reviews ? parseInt(reviews) : undefined,
        images: imageCreateList.length > 0 ? {
          create: imageCreateList
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
    const productId = parseInt(id)
    const { name, description, price, stock, categoryId, imageUrl, images, subtitle, badge, details, sold, rating, reviews } = req.body
    
    if (images !== undefined || imageUrl !== undefined) {
      let imageList = []
      if (Array.isArray(images)) {
        imageList = images.map(img => {
          if (typeof img === 'string') return img.trim()
          if (img && typeof img === 'object' && img.imageUrl) return img.imageUrl.trim()
          return null
        }).filter(Boolean)
      } else if (typeof imageUrl === 'string' && imageUrl.trim()) {
        imageList = [imageUrl.trim()]
      }

      // Re-create images in ProductImage table
      await prisma.productImage.deleteMany({
        where: { productId }
      })

      if (imageList.length > 0) {
        await prisma.productImage.createMany({
          data: imageList.map(url => ({
            productId,
            imageUrl: url
          }))
        })
      }
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        subtitle: subtitle !== undefined ? subtitle : undefined,
        badge: badge !== undefined ? badge : undefined,
        details: details !== undefined ? details : undefined,
        sold: sold !== undefined ? parseInt(sold) : undefined,
        rating: rating !== undefined ? String(rating) : undefined,
        reviews: reviews !== undefined ? parseInt(reviews) : undefined
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
    const productId = parseInt(req.params.id)

    // 1. Delete associated product images first
    await prisma.productImage.deleteMany({
      where: { productId }
    })

    // 2. Delete associated cart items
    await prisma.cartItem.deleteMany({
      where: { productId }
    })

    // 3. Delete the product itself
    await prisma.product.delete({
      where: { id: productId }
    })

    res.json({ message: 'ลบสินค้าเรียบร้อย' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
