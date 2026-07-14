const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.changelog.create({
    data: {
      version: 'v2.0.0',
      category: 'Design',
      summary: 'Editorial Brand Rebirth — Brutalist Design Overhaul',
      notes: 'CertVault v2.0.0 represents a complete visual rebirth:\n- Replaced branding with a monochromatic, high-contrast, editorial layout.\n- Loaded Syne, Playfair Display, and Space Grotesk fonts globally.\n- Configured an animated grain paper texture background.\n- Added a scrolling credentials ticker header.\n- Refactored all components to use brutalist flat-shadow border boxes.\n- Introduced asymmetric hover tilts for certificates.\n- Created a split-screen details view with border-locked document previw frames.',
    }
  });
  console.log('v2.0.0 changelog seeded');
}

main().catch(console.error).finally(() => prisma.$disconnect());
