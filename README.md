# CertVault — Personal Credentials Hub & API Showcase

A secure, high-contrast, brutalist platform to consolidate, verify, and expose your professional achievements to custom external web portfolios. Built for developers who document their journey.

---

## Key Features

### 1. Unified Certificate Dashboard
- **Consolidated Records**: Keep track of all certificates, issuers, issue dates, and expiry tracking in one central location.
- **Verification Links**: Store verification verification links directly on your metadata cards.
- **Document Previews**: Upload PDF copies or images of certificates for quick split-screen viewing.

### 2. Developer API Integration Hub
- **Private Access Tokens**: Generate secure cryptographic keys (`cv_...`) to programmatically fetch your entire credential library in JSON format.
- **Public API Feed**: Enable a public endpoint for a specific custom slug (`/api/v1/vault/your-name`) to fetch only public certificates directly from frontend portfolio apps (e.g. Next.js, React, or static Jekyll sites).
- **Interactive Code Blocks**: Copy exact syntax templates for **cURL**, **JavaScript Fetch**, and **Python Requests** directly from the settings page.

### 3. Fortified Security
- **IP Rate Limiting**: Next.js Edge limits rate flooding (max 100 requests per minute) on public endpoints.
- **Hashed Credentials**: API access tokens are hashed via `SHA-256` before storing to protect against database leaks.
- **MIME & Size Restrictions**: Uploaded documents are restricted to PDF and standard images, constrained under `4.5MB` to comply with serverless execution boundaries.
- **HTTP Hardening**: Strict Content Security Policy (CSP), X-Frame-Options (Clickjacking defense), and HSTS forced on all response flows.

---

## How to Use CertVault

### 1. Adding Credentials
1. Go to **Certificates** and click **Add Certificate**.
2. Enter the credential details (Title, Issuer, Dates, Verification URL).
3. Select a PDF or image of your certificate.
4. Toggle "Allow this certificate to be queried via the Public JSON API" if you want it visible on your external public feed.

### 2. Integrating into your Personal Website
1. Go to **Developer API**.
2. Click **Generate Developer API Key** (Make sure to copy the key immediately as it will be masked on subsequent views).
3. If using a frontend JS framework, turn on the **Public Portfolio Endpoint**, type your slug, and copy the public JSON endpoint url.
4. Use the provided Fetch/cURL code snippets in your portfolio code to render your credentials dynamically!

---

## License
Proprietary Software. Copyright (c) 2026 MR-1124. All Rights Reserved. Refer to the LICENSE file for details.
