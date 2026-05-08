import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "url param required" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "NewWardrobe/1.0" },
      // Stream the response — do NOT buffer the entire file
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${response.status}` },
        { status: response.status }
      );
    }

    const contentLength = response.headers.get("content-length");
    const headers: HeadersInit = {
      "Content-Type": "model/gltf-binary",
      "Cache-Control": "public, max-age=86400, immutable",
      "Access-Control-Allow-Origin": "*",
    };
    if (contentLength) headers["Content-Length"] = contentLength;

    // Pipe the readable stream directly — no buffering
    return new NextResponse(response.body, { status: 200, headers });
  } catch (err) {
    console.error("[proxy-glb] fetch failed:", err);
    return NextResponse.json({ error: "Fetch failed" }, { status: 502 });
  }
}
