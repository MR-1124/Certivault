# CertVault — Developer Credentials Studio & Public API Showcase

A refined, developer-first platform to consolidate, verify, and programmatically showcase professional certifications, credentials, and achievements.

---

## 🚀 Key Capabilities & Features

### 1. Modern Credential Studio & Library
- **Unified Ledger**: Track certifications, issuing organizations, verification links, and validity timelines.
- **Renewal Radar**: Real-time progress bars and automated countdown radar for credentials expiring within 90 days.
- **View Flexibility**: Instant switcher between responsive **Grid View** and compact **Dense Table View**.
- **Interactive Split Inspector**: Split-screen inspector with **Overview & Metadata** vs. **Raw API JSON (`/api/v1`)** viewer alongside responsive high-res PDF and image document previews.

### 2. Public Hosted Showcase (`/vault/[slug]`)
- **Shareable Public Profile**: Direct URL (`certivault.app/vault/alex`) to showcase your verified credentials on LinkedIn, resumes, and personal websites.
- **Schema.org JSON-LD**: Embedded `EducationalOccupationalCredential` structured data for search engine rich snippets and SEO.
- **Responsive Document Viewer**: High-resolution document viewer modal for visiting recruiters and engineers.

### 3. Live Dynamic SVG Badges for GitHub READMEs (`/api/v1/badge/[slug]`)
- **Live Vector Badges**: Edge-rendered vector badges for embedding directly into GitHub profile `README.md` files.
- **Supported Types**:
  ```markdown
  [![CertVault Verified](https://certivault.app/api/v1/badge/alex?type=verified)](https://certivault.app/vault/alex)
  [![Active Certifications](https://certivault.app/api/v1/badge/alex?type=count)](https://certivault.app/vault/alex)
  [![Validity Status](https://certivault.app/api/v1/badge/alex?type=status)](https://certivault.app/vault/alex)
  ```

### 4. Gemini AI Smart Document Parser
- **Multimodal OCR**: Dropping a certificate PDF or image document automatically triggers Gemini 2.5 Flash OCR to extract **Title**, **Issuer**, **Issue Date**, **Expiration Date**, and **Credential ID** into form fields.

### 5. Embeddable Portfolio Widget (`/embed/vault/[slug]`)
- **Lightweight Iframe**: Drop an interactive credentials widget into Framer, Webflow, Notion, WordPress, or custom React apps with dark and light theme options.

### 6. Developer API Hub, Telemetry & Webhooks
- **Private Access Tokens**: Secure cryptographic tokens (`cv_...`) to programmatically fetch your entire credential archive.
- **CORS Public Feeds**: Configure custom slugs (`/api/v1/vault/[slug]`) for direct client-side requests.
- **API Request Telemetry**: Track 7-day request volumes, status distributions, and top inbound referrers.
- **Renewal Webhook Alerts**: Automated notification payloads sent to Discord, Slack, Zapier, or custom backends when credentials approach expiration (60d, 30d, 7d).

### 7. Vault Backup & Data Portability
- **1-Click Vault Export**: Download all certificate metadata and Schema.org JSON-LD as a structured JSON archive.
- **Bulk Import**: Batch-upload and restore credentials from JSON backups.

---

## 🛠️ Getting Started

### Local Development
```bash
# Install dependencies
npm install

# Push Prisma schema to PostgreSQL
npx prisma db push

# Generate Prisma client
npx prisma generate

# Start dev server
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

---

## 📄 License
Proprietary Software. Copyright (c) 2026 MR-1124. All Rights Reserved. Refer to the [LICENSE](LICENSE) file for details.
