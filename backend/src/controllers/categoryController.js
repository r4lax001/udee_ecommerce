import { prisma } from '../lib/prisma.js'

export async function getCategories(req, res) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    })
    res.json(categories)
  } catch (err) {
    console.error('[categories] error:', err)
    res.status(500).json({ error: 'Internal server error', detail: err.message })
  }
}
