const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.changelog.create({
    data: {
      version: 'v1.4.0',
      category: 'Feature',
      summary: 'Certificate Details Page & Document Preview Panel',
      notes: 'CertVault now has a dedicated details view:\n- Dynamically check ownership/existence of certificates via secure dynamic routing.\n- Detect uploaded file types (PDF vs Images).\n- Render inline PDF previews with scrolling/zooming inside iframes.\n- Render image previews with scale-in animations.\n- Fallback download actions for unsupported types.\n- Linked certificate titles and dashboard activity items to details page.',
    }
  });
  console.log('v1.4.0 changelog seeded');
}

main().catch(console.error).finally(() => prisma.$disconnect());
