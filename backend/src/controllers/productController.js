import { prisma } from '../lib/prisma.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadDir = path.join(__dirname, '../../public/uploads')

export async function getProducts(req, res) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true,
      },
      orderBy: { id: 'desc' },
    })
    res.json(products)
  } catch (err) {
    console.error('[products] get error:', err)
    res.status(500).json({ error: 'Internal server error', detail: err.message })
  }
}

export async function createProduct(req, res) {
  try {
    const { name, description, price, stock, categoryId } = req.body
    
    // Convert string fields to correct types
    const parsedPrice = parseFloat(price)
    const parsedStock = parseInt(stock, 10)
    const parsedCategoryId = parseInt(categoryId, 10)

    // Handle image upload
    const imagesData = []
    if (req.file) {
      imagesData.push({
        imageUrl: `/uploads/${req.file.filename}`
      })
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parsedPrice,
        stock: parsedStock,
        categoryId: parsedCategoryId,
        images: {
          create: imagesData
        }
      },
      include: {
        category: true,
        images: true,
      }
    })

    res.status(201).json(product)
  } catch (err) {
    console.error('[products] create error:', err)
    res.status(500).json({ error: 'Internal server error', detail: err.message })
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params
    const { name, description, price, stock, categoryId } = req.body

    const parsedId = parseInt(id, 10)
    const parsedPrice = parseFloat(price)
    const parsedStock = parseInt(stock, 10)
    const parsedCategoryId = parseInt(categoryId, 10)

    const updateData = {
      name,
      description,
      price: parsedPrice,
      stock: parsedStock,
      categoryId: parsedCategoryId,
    }

    if (req.file) {
      // First delete existing images logic if we want to replace
      const existingImages = await prisma.productImage.findMany({
        where: { productId: parsedId }
      })
      
      for (const img of existingImages) {
        const filePath = path.join(uploadDir, img.imageUrl.replace('/uploads/', ''))
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      }

      await prisma.productImage.deleteMany({
        where: { productId: parsedId }
      })

      // Add new image
      updateData.images = {
        create: [{ imageUrl: `/uploads/${req.file.filename}` }]
      }
    }

    const product = await prisma.product.update({
      where: { id: parsedId },
      data: updateData,
      include: {
        category: true,
        images: true,
      }
    })

    res.json(product)
  } catch (err) {
    console.error('[products] update error:', err)
    res.status(500).json({ error: 'Internal server error', detail: err.message })
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params
    const parsedId = parseInt(id, 10)

    const existingImages = await prisma.productImage.findMany({
      where: { productId: parsedId }
    })
    
    // delete physical files
    for (const img of existingImages) {
      const filePath = path.join(uploadDir, img.imageUrl.replace('/uploads/', ''))
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    // delete image records first
    await prisma.productImage.deleteMany({
      where: { productId: parsedId }
    })

    // Then delete orderItems/cartItems to maintain referential integrity if needed
    // or rely on cascading deletes if configured in schema.
    // In our schema, cartItems and orderItems do NOT have onDelete: Cascade set.
    // So we must delete them manually or change the schema.
    // For this workshop, let's manually delete them to prevent foreign key constraint errors
    await prisma.cartItem.deleteMany({ where: { productId: parsedId } })
    await prisma.orderItem.deleteMany({ where: { productId: parsedId } })

    const product = await prisma.product.delete({
      where: { id: parsedId }
    })

    res.json({ message: 'Product deleted successfully', product })
  } catch (err) {
    console.error('[products] delete error:', err)
    res.status(500).json({ error: 'Internal server error', detail: err.message })
  }
}
