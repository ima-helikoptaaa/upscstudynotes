import { prisma } from "@/lib/prisma";
import { signAccessToken, signRefreshToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const { phone, countryCode = "+91", otp, name, attemptYear, coaching } = await request.json();

  if (!phone || !otp) {
    return NextResponse.json({ error: "Phone and OTP required" }, { status: 400 });
  }

  const otpRecord = await prisma.otpValidation.findFirst({
    where: {
      countryCode,
      phone,
      otp,
      isVerified: false,
      isDeleted: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otpRecord) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
  }

  await prisma.otpValidation.update({
    where: { id: otpRecord.id },
    data: { isVerified: true, verifiedAt: new Date() },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await prisma.$transaction(async (tx: any) => {
    let user = await tx.user.findFirst({
      where: { countryCode, phone, isDeleted: false },
    });

    if (!user) {
      user = await tx.user.create({
        data: {
          countryCode,
          phone,
          name: name || null,
          attemptYear: attemptYear ? parseInt(attemptYear, 10) : null,
          coaching: coaching || null,
        },
      });
    } else if (name || attemptYear || coaching) {
      user = await tx.user.update({
        where: { id: user.id },
        data: {
          ...(name && { name }),
          ...(attemptYear && { attemptYear: parseInt(attemptYear, 10) }),
          ...(coaching && { coaching }),
        },
      });
    }

    let account = await tx.account.findFirst({
      where: { userId: user.id, provider: "phone", isDeleted: false },
    });

    if (!account) {
      account = await tx.account.create({
        data: {
          userId: user.id,
          type: "phone",
          provider: "phone",
          providerAccountId: `${countryCode}${phone}`,
        },
      });
    }

    const jwtRecord = await tx.jWT.create({
      data: {
        accountId: account.id,
        refreshTokenExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
    });

    const accessToken = await signAccessToken({
      sub: user.id,
      jwtId: jwtRecord.id,
      accountId: account.id,
      phone: user.phone,
      name: user.name,
    });

    const refreshToken = await signRefreshToken(jwtRecord.id);

    await tx.jWT.update({
      where: { id: jwtRecord.id },
      data: { refreshToken },
    });

    return { user, accessToken, refreshToken };
  });

  const cookieStore = await cookies();
  cookieStore.set("token", result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 24 * 60 * 60,
    path: "/",
  });

  return NextResponse.json({
    user: {
      id: result.user.id,
      name: result.user.name,
      phone: result.user.phone,
      attemptYear: result.user.attemptYear,
      coaching: result.user.coaching,
    },
    accessToken: result.accessToken,
  });
}
