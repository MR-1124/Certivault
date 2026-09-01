import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "verified";
  const theme = searchParams.get("theme") || "dark";

  // Check if vault is public
  const portfolio = await prisma.portfolioSetting.findUnique({
    where: { customSlug: slug, isPublic: true },
    include: {
      user: {
        select: {
          certificates: {
            where: { isPublic: true },
          },
        },
      },
    },
  });

  if (!portfolio) {
    // Return a neat "Not Found / Private" SVG badge
    const svg = generateBadgeSvg({
      label: "CertVault",
      value: "Private Vault",
      labelBg: "#1e293b",
      valueBg: "#64748b",
    });
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=60",
      },
    });
  }

  const certs = portfolio.user.certificates;
  const verifiedCount = certs.filter((c) => c.verified).length;
  const totalCount = certs.length;

  let label = "CertVault";
  let value = `${verifiedCount} Verified`;
  let labelBg = "#0f172a";
  let valueBg = "#059669"; // emerald-600

  if (type === "total" || type === "count") {
    label = "Certificates";
    value = `${totalCount} Stored`;
    valueBg = "#2563eb"; // blue-600
  } else if (type === "status") {
    label = "CertVault";
    const now = new Date();
    const expiredCount = certs.filter((c) => c.expirationDate && new Date(c.expirationDate) < now).length;
    if (expiredCount === 0) {
      value = "Active";
      valueBg = "#10b981"; // emerald-500
    } else {
      value = `${expiredCount} Expired`;
      valueBg = "#f59e0b"; // amber-500
    }
  }

  const svg = generateBadgeSvg({
    label,
    value,
    labelBg,
    valueBg,
  });

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=120, s-maxage=300, stale-while-revalidate=600",
    },
  });
}

function generateBadgeSvg({
  label,
  value,
  labelBg,
  valueBg,
}: {
  label: string;
  value: string;
  labelBg: string;
  valueBg: string;
}) {
  // Approximate text widths (7.5px per character + padding)
  const labelWidth = Math.max(30, Math.round(label.length * 7.2) + 16);
  const valueWidth = Math.max(30, Math.round(value.length * 7.2) + 20);
  const totalWidth = labelWidth + valueWidth;
  const height = 24;

  const labelX = Math.round(labelWidth / 2);
  const valueX = labelWidth + Math.round(valueWidth / 2);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" viewBox="0 0 ${totalWidth} ${height}" role="img" aria-label="${label}: ${value}">
  <title>${label}: ${value}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#fff" stop-opacity=".15"/>
    <stop offset="100%" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="${height}" rx="5" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="${height}" fill="${labelBg}"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="${height}" fill="${valueBg}"/>
    <rect width="${totalWidth}" height="${height}" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="${labelX * 10}" y="160" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(labelWidth - 14) * 10}">${label}</text>
    <text x="${labelX * 10}" y="150" fill="#f8fafc" font-weight="600" transform="scale(.1)" textLength="${(labelWidth - 14) * 10}">${label}</text>
    <text aria-hidden="true" x="${valueX * 10}" y="160" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(valueWidth - 16) * 10}">${value}</text>
    <text x="${valueX * 10}" y="150" fill="#ffffff" font-weight="700" transform="scale(.1)" textLength="${(valueWidth - 16) * 10}">${value}</text>
  </g>
</svg>`;
}
