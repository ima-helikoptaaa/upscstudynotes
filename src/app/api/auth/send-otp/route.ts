import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  const { phone, countryCode = "+91" } = await request.json();

  if (!phone || !/^\d{10}$/.test(phone)) {
    return NextResponse.json({ error: "Valid 10-digit phone required" }, { status: 400 });
  }

  const existing = await prisma.otpValidation.findFirst({
    where: {
      countryCode,
      phone,
      isVerified: false,
      isDeleted: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    const timeSinceLastSend = Date.now() - existing.lastTriggerTime.getTime();
    if (timeSinceLastSend < 30000) {
      return NextResponse.json(
        { error: "Please wait 30 seconds before requesting another OTP" },
        { status: 429 }
      );
    }

    await prisma.otpValidation.update({
      where: { id: existing.id },
      data: { lastTriggerTime: new Date() },
    });

    console.log(`[DEV] OTP for ${countryCode}${phone}: ${existing.otp}`);

    const user = await prisma.user.findFirst({ where: { countryCode, phone, isDeleted: false } });
    return NextResponse.json({ success: true, isNewUser: !user, demoOtp: existing.otp });
  }

  const otp = generateOtp();
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  await prisma.otpValidation.create({
    data: {
      countryCode,
      phone,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      ipAddress,
      userAgent,
    },
  });

  console.log(`[DEV] OTP for ${countryCode}${phone}: ${otp}`);

  const user = await prisma.user.findFirst({ where: { countryCode, phone, isDeleted: false } });
  return NextResponse.json({ success: true, isNewUser: !user, demoOtp: otp });
}
