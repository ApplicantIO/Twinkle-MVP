import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@twinkle.uz' },
    update: {},
    create: {
      email: 'admin@twinkle.uz',
      passwordHash,
      role: 'ADMIN',
      isVerified: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);
  console.log('   Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

