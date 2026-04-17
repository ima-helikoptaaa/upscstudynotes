"use client";

import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pdfjsLib: any = null;
async function getPdfjs() {
  if (pdfjsLib) return pdfjsLib;
  pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  return pdfjsLib;
}

const thumbCache = new Map<string, string>();
const inflight = new Map<string, Promise<string | null>>();

function renderThumb(url: string, height: number): Promise<string | null> {
  const cached = thumbCache.get(url);
  if (cached) return Promise.resolve(cached);

  const existing = inflight.get(url);
  if (existing) return existing;

  const p = (async () => {
    try {
      const pdfjs = await getPdfjs();
      const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(url)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) return null;
      const buf = await res.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;
      const page = await pdf.getPage(1);

      const scale = (height * 2) / page.getViewport({ scale: 1 }).height;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;

      await page.render({ canvasContext: ctx, viewport }).promise;

      const data = canvas.toDataURL("image/webp", 0.85);
      thumbCache.set(url, data);
      pdf.destroy();
      return data;
    } catch (err) {
      console.error("PDFThumbnail render failed:", err);
      return null;
    } finally {
      inflight.delete(url);
    }
  })();

  inflight.set(url, p);
  return p;
}

export function PDFThumbnail({
  url,
  height = 160,
  className,
}: {
  url: string;
  height?: number;
  className?: string;
}) {
  const [dataUrl, setDataUrl] = useState<string | null | undefined>(thumbCache.get(url));

  useEffect(() => {
    if (dataUrl !== undefined) return;
    let cancelled = false;
    renderThumb(url, height).then((result) => {
      if (!cancelled) setDataUrl(result);
    });
    return () => { cancelled = true; };
  }, [url, height, dataUrl]);

  if (dataUrl) {
    return (
      <img
        src={dataUrl}
        alt=""
        className={className}
        style={{ width: "100%", height, objectFit: "cover", objectPosition: "top" }}
      />
    );
  }

  return null;
}
