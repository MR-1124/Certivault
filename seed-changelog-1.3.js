const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.changelog.create({
    data: {
      version: 'v1.3.0',
      category: 'Design',
      summary: 'Premium UI v2.0 — Framer Motion & Animated Design System',
      notes: 'CertVault received a full design-system overhaul:\n- Installed framer-motion, react-type-animation, react-intersection-observer.\n- Animated floating background orbs on all pages.\n- Staggered Framer Motion entrance animations on Dashboard stats and Certificate cards.\n- Animated gradient headline with multi-stop color shifting.\n- Premium spring-animated Navbar with logo hover effect.\n- Accent color strip on certificate cards.\n- Custom animated scrollbar and glow-ring CSS utilities.\n- Upgraded typography to font-black with tighter tracking.',
    }
  });
  console.log('v1.3.0 changelog seeded');
}

main().catch(console.error).finally(() => prisma.$disconnect());
