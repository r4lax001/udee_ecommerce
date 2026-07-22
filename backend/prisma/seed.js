import { PrismaClient } from '../generated/prisma/index.js'
import { productCards } from './seedData.js'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Cleaning database...')
  // Delete in order of dependencies to avoid foreign key errors
  await prisma.cartItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  console.log('Database cleaned.')

  console.log('Starting seeding...')

  // Filter out any invalid items
  const validProducts = productCards.filter(p => p.title && p.price > 0)

  for (const item of validProducts) {
    // 1. Get or create category
    let category = await prisma.category.findFirst({
      where: { name: item.category }
    })

    if (!category) {
      category = await prisma.category.create({
        data: { name: item.category }
      })
      console.log(`Created Category: ${item.category}`)
    }

    // Prepare description (handle Array vs String)
    const descriptionText = Array.isArray(item.description)
      ? item.description.join('\n')
      : item.description || ''

    // Prepare details JSON object
    const details = {
      size: item.size || null,
      colors: item.colors || [],
      material: item.material || null,
      highlights: item.highlights || [],
      generalProperties: item.generalProperties || [],
      warranty: item.warranty || null
    }

    // 2. Create Product
    const createdProduct = await prisma.product.create({
      data: {
        name: item.title,
        description: descriptionText,
        price: item.price,
        stock: item.stock || 0,
        categoryId: category.id,
        subtitle: item.subtitle || null,
        badge: item.badge || null,
        details: details,
        sold: item.sold || 0,
        rating: item.rating ? String(item.rating) : null,
        reviews: item.reviews || 0
      }
    })

    console.log(`Created Product: ${createdProduct.name} (ID: ${createdProduct.id})`)

    // 3. Create ProductImages
    // Insert main image
    if (item.image) {
      await prisma.productImage.create({
        data: {
          imageUrl: item.image,
          productId: createdProduct.id
        }
      })
    }

    // Insert gallery images (excluding duplicates of main image)
    if (item.gallery && Array.isArray(item.gallery)) {
      for (const imageUrl of item.gallery) {
        if (imageUrl && imageUrl !== item.image) {
          await prisma.productImage.create({
            data: {
              imageUrl,
              productId: createdProduct.id
            }
          })
        }
      }
    }
  }

  // ─── 4. Seed Users ──────────────────────────────────────────────────────────
  console.log('Starting user seeding...')
  const defaultPassword = await bcrypt.hash('Password123', 12)
  const usersToCreate = [
    {
      name: 'AdminV2',
      email: 'admin@udee.co.th',
      password: defaultPassword,
      phone: '0899999999',
      role: 'ADMIN',
      isVerified: true
    },
    {
      name: 'ManagerV2',
      email: 'manager@udee.co.th',
      password: defaultPassword,
      phone: '0888888888',
      role: 'MANAGER',
      isVerified: true
    },
    {
      name: 'UserV2',
      email: 'customer@udee.co.th',
      password: defaultPassword,
      phone: '0877777777',
      role: 'CUSTOMER',
      isVerified: true
    }
  ]

  for (const userData of usersToCreate) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    })
    if (!existingUser) {
      const created = await prisma.user.create({ data: userData })
      console.log(`Created User: ${created.email} with Role: ${created.role}`)
    } else {
      console.log(`User ${userData.email} already exists. Updating role...`)
      await prisma.user.update({
        where: { email: userData.email },
        data: { role: userData.role }
      })
    }
  }

  console.log('Seeding finished successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
