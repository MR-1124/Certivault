const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.changelog.create({
    data: {
      version: 'v2.2.0',
      category: 'Security',
      summary: 'Security Headers, Hashed Tokens, Zod Validation, and Vercel Postgres Ready',
      notes: 'CertVault is fully secured:\n- Created Next.js edge middleware introducing IP-based API rate limiting.\n- Injected response security headers (CSP, HSTS, X-Frame-Options Clickjacking mitigation, and Referrer policy).\n- Implemented strict payload shape assertions via Zod schemas during register and certificate creations.\n- Overhauled API keys to hash secrets using SHA-256 before database storage, preventing plain-text token leaks.\n- Switched Prisma client datasource providers to PostgreSQL to support serverless connection pooling on Vercel.',
    }
  });
  console.log('v2.2.0 changelog seeded');
}

main().catch(console.error).finally(() => prisma.$disconnect());
