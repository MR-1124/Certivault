const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.changelog.create({
    data: {
      version: 'v1.0.0',
      category: 'Release',
      summary: 'Initial Release of CertVault',
      notes: 'Welcome to CertVault! This is the first release featuring:\n- Secure Authentication\n- Certificate Management\n- Public Portfolio generation\n- Next.js 15 App Router architecture',
    }
  });
  console.log('Changelog seeded');
}

main().catch(console.error).finally(() => prisma.$disconnect());
