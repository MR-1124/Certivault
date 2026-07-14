const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.changelog.create({
    data: {
      version: 'v2.1.0',
      category: 'Feature',
      summary: 'Developer API Hub & Secure Access Token Pivot',
      notes: 'CertVault is now developer-first:\n- Removed legacy HTML portfolio page (/u/[slug]).\n- Added apiKey token field to User database schema.\n- Created /api/v1/certificates secure JSON endpoint using X-CertVault-API-Key validation.\n- Created /api/v1/vault/[slug] public credentials JSON endpoint.\n- Built a comprehensive Developer Integration Hub showing API credentials, key rotation, and interactive tabs containing cURL, JavaScript, and Python code blocks.',
    }
  });
  console.log('v2.1.0 changelog seeded');
}

main().catch(console.error).finally(() => prisma.$disconnect());
