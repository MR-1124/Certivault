import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge-safe in-memory rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 60000; // 1 minute

function cleanupStore() {
  const now = Date.now();
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    }
    lastCleanup = now;
  }
}

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // 1. Inject Strict Response Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  
  // Custom Content Security Policy supporting inline fonts/styles and extension helpers
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://*.perplexity.ai; img-src 'self' data: blob:; font-src 'self' data: https://*.perplexity.ai; connect-src 'self' https://*.perplexity.ai; frame-src 'self' blob:; object-src 'none';"
  );

  // 2. API Rate Limiting for edge nodes
  if (request.nextUrl.pathname.startsWith("/api/v1/")) {
    cleanupStore();

    // Resolve client IP identifier
    const ip = (request as any).ip || request.headers.get("x-forwarded-for") || "anonymous";
    const limit = 100; // max 100 requests per 1-minute window
    const windowMs = 60000; // 1 minute
    
    const now = Date.now();
    const currentVal = rateLimitStore.get(ip);

    if (!currentVal) {
      rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    } else {
      if (now > currentVal.resetTime) {
        rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
      } else {
        currentVal.count += 1;
        if (currentVal.count > limit) {
          return new NextResponse(
            JSON.stringify({ success: false, error: "Too many requests. Rate limit exceeded." }),
            {
              status: 429,
              headers: {
                "Content-Type": "application/json",
                "Retry-After": Math.ceil((currentVal.resetTime - now) / 1000).toString(),
              },
            }
          );
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
