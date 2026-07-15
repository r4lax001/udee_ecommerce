import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

export default prisma;
