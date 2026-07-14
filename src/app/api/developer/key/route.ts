import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// GET current key
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await (prisma.user as any).findUnique({
      where: { id: session.user.id },
      select: { apiKey: true },
    });

    const maskedKey = user?.apiKey ? "cv_••••••••••••••••••••" : null;

    return NextResponse.json({ success: true, apiKey: maskedKey });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// POST generate new key
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const newKey = `cv_${crypto.randomBytes(24).toString("hex")}`;
    const keyHash = crypto.createHash("sha256").update(newKey).digest("hex");

    await (prisma.user as any).update({
      where: { id: session.user.id },
      data: { apiKey: keyHash },
    });

    return NextResponse.json({ success: true, apiKey: newKey });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE revoke key
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await (prisma.user as any).update({
      where: { id: session.user.id },
      data: { apiKey: null },
    });

    return NextResponse.json({ success: true, apiKey: null });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
