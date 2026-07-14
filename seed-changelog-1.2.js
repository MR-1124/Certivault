const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.changelog.create({
    data: {
      version: 'v1.2.0',
      category: 'Feature',
      summary: 'Search & Expanded Features',
      notes: 'CertVault received new features and bug fixes:\n- Added real-time search and filtering on the Certificates page.\n- Expanded the landing page with feature highlights.\n- Fixed Dashboard Recent Activity to show latest certificates.\n- Redesigned forms with premium glassmorphism aesthetics.',
    }
  });
  console.log('v1.2.0 changelog seeded');
}

main().catch(console.error).finally(() => prisma.$disconnect());
