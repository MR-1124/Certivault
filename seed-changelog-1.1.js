const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.changelog.create({
    data: {
      version: 'v1.1.0',
      category: 'Design',
      summary: 'Premium UI/UX Overhaul',
      notes: 'CertVault received a major design upgrade:\n- Glassmorphism navigation.\n- Premium stat cards and animated dashboards.\n- Modern typography using the Inter font family.\n- Fluid entry animations on public portfolio.',
    }
  });
  console.log('v1.1.0 changelog seeded');
}

main().catch(console.error).finally(() => prisma.$disconnect());
