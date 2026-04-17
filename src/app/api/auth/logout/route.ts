import { verifyAccessToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    const payload = await verifyAccessToken(token);
    if (payload?.jwtId) {
      await prisma.jWT.update({
        where: { id: payload.jwtId },
        data: { isDeleted: true },
      });
    }
  }

  cookieStore.delete("token");
  return NextResponse.json({ success: true });
}
