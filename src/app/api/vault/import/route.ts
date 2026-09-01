import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const certList = Array.isArray(body) ? body : Array.isArray(body.certificates) ? body.certificates : null;

    if (!certList || certList.length === 0) {
      return NextResponse.json({ error: "Invalid backup payload or empty certificates list." }, { status: 400 });
    }

    let importedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < certList.length; i++) {
      const item = certList[i];
      if (!item.title || !item.issuer || !item.issueDate) {
        errors.push(`Item ${i + 1} skipped: missing required title, issuer, or issueDate.`);
        continue;
      }

      await prisma.certificate.create({
        data: {
          userId: session.user.id,
          title: item.title.trim(),
          issuer: item.issuer.trim(),
          issueDate: new Date(item.issueDate),
          expirationDate: item.expirationDate ? new Date(item.expirationDate) : null,
          credentialId: item.credentialId ? String(item.credentialId).trim() : null,
          credentialUrl: item.credentialUrl ? String(item.credentialUrl).trim() : null,
          verified: Boolean(item.verified),
          isPublic: Boolean(item.isPublic),
          fileUrl: item.fileUrl || null,
        },
      });
      importedCount++;
    }

    return NextResponse.json({
      success: true,
      importedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process import." }, { status: 500 });
  }
}
