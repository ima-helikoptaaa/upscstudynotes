import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOST = "d1xzxglpo1zn8i.cloudfront.net";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }

  try {
    const parsed = new URL(url);
    if (parsed.hostname !== ALLOWED_HOST) {
      return NextResponse.json({ error: "not allowed" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  const res = await fetch(url);
  if (!res.ok) {
    return NextResponse.json({ error: "fetch failed" }, { status: 502 });
  }

  const buffer = await res.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
