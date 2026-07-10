import { PrismaClient } from './generated/prisma/index.js'

const prisma = new PrismaClient()

async function main() {
  const categories = ['โต๊ะทำงาน', 'กินข้าว', 'ตกแต่ง']
  
  for (const name of categories) {
    const exists = await prisma.category.findFirst({ where: { name } })
    if (!exists) {
      await prisma.category.create({ data: { name } })
    }
  }
  console.log('Categories seeded successfully')
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
