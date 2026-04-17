import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-in-production");

const ACCESS_TOKEN_EXPIRY = "10d";
const REFRESH_TOKEN_EXPIRY = "90d";

interface TokenPayload {
  sub: string;
  type: "access_token";
  jwtId: string;
  accountId: string;
  phone: string;
  name: string | null;
}

export async function signAccessToken(payload: Omit<TokenPayload, "type">) {
  return new SignJWT({ ...payload, type: "access_token" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .setIssuedAt()
    .sign(SECRET);
}

export async function signRefreshToken(jwtId: string) {
  return new SignJWT({ sub: jwtId, type: "refresh_token" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .setIssuedAt()
    .sign(SECRET);
}

export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (payload.type !== "access_token") return null;
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const payload = await verifyAccessToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.sub, isDeleted: false },
  });
  return user;
}
