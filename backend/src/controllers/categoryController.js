import prisma from '../db.js'

// GET /api/categories - ดูหมวดหมู่ทั้งหมด
export async function getCategories(req, res) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          select: { id: true, name: true }
        }
      }
    })
    res.json(categories)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /api/categories - เพิ่มหมวดหมู่
export async function createCategory(req, res) {
  try {
    const { name } = req.body
    const category = await prisma.category.create({
      data: { name }
    })
    res.status(201).json(category)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// PUT /api/categories/:id - แก้ไขหมวดหมู่
export async function updateCategory(req, res) {
  try {
    const { id } = req.params
    const { name } = req.body
    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name }
    })
    res.json(category)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// DELETE /api/categories/:id - ลบหมวดหมู่
export async function deleteCategory(req, res) {
  try {
    const { id } = req.params
    await prisma.category.delete({
      where: { id: parseInt(id) }
    })
    res.json({ message: 'ลบหมวดหมู่เรียบร้อย' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
