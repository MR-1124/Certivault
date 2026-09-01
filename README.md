# CertVault — Developer Credentials Studio & Public API Showcase

A refined, high-utility platform to consolidate, verify, and programmatically expose your professional achievements to custom portfolio websites, resumes, and web applications.

---

## Key Features

### 1. Modern Credential Studio & Library
- **Unified Ledger**: Track professional certifications, issuing organizations, credential identifiers, and validity timelines.
- **Validity Lifecycle Radar**: Real-time progress bars and automated countdown radar for credentials expiring within 90 days.
- **View Flexibility**: Instant switcher between responsive **Grid View** and compact **Dense Table View**.
- **Interactive Split Inspector**: Split-screen inspector with **Overview & Metadata** vs. **Raw API JSON (`/api/v1`)** viewer alongside responsive high-res PDF and image document previews.

### 2. Developer API & Public Feed Hub
- **Private Access Tokens**: Generate secure cryptographic tokens (`cv_...`) to programmatically fetch your entire credential archive via server-side code.
- **CORS-Enabled Public Portfolio Feed**: Configure custom slugs (`/api/v1/vault/[slug]`) to query public certificates directly from frontend web apps without exposing API keys.
- **Interactive Code Playground**: Copy-paste integration snippets in **cURL**, **JavaScript (Fetch)**, **Python (Requests)**, and **Public Feed**.

### 3. Fortified Security & Architecture
- **Edge IP Rate Limiting**: Built on Next.js Edge proxy to prevent rate flooding (100 req/min) on API routes.
- **Cryptographic Token Hashing**: API access tokens are stored as `SHA-256` hashes in Neon PostgreSQL to prevent credential leaks.
- **MIME & Size Restrictions**: Uploaded certificates are validated and constrained under 4.5MB for optimal serverless throughput.
- **HTTP Hardening**: Strict Content Security Policy (CSP), X-Frame-Options Clickjacking mitigation, and HSTS applied across all routes.

---

## Getting Started

### Local Development
```bash
# Install dependencies
npm install

# Run database migrations
npx prisma db push

# Start development server
npm run dev
```

### Building for Production
```bash
npm run build
npm run start
```

---

## License
Proprietary Software. Copyright (c) 2026 MR-1124. All Rights Reserved. Refer to the [LICENSE](LICENSE) file for details.
