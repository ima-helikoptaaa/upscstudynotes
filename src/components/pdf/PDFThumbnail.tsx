"use client";

import { useRef, useEffect, useState } from "react";

const WORKER_SRC = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.worker.min.mjs`;

let pdfjsLib: typeof import("pdfjs-dist") | null = null;
async function getPdfjs() {
  if (pdfjsLib) return pdfjsLib;
  pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_SRC;
  return pdfjsLib;
}

const thumbCache = new Map<string, string>();

export function PDFThumbnail({
  url,
  height = 160,
  className,
}: {
  url: string;
  height?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string | undefined>(thumbCache.get(url));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (dataUrl || failed) return;
    let cancelled = false;

    (async () => {
      try {
        const pdfjs = await getPdfjs();
        const pdf = await pdfjs.getDocument({ url, disableAutoFetch: true, disableStream: true }).promise;
        const page = await pdf.getPage(1);

        const scale = (height * 2) / page.getViewport({ scale: 1 }).height;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        if (!cancelled) {
          const data = canvas.toDataURL("image/webp", 0.85);
          thumbCache.set(url, data);
          setDataUrl(data);
        }
        pdf.destroy();
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => { cancelled = true; };
  }, [url, height, dataUrl, failed]);

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

  return <canvas ref={canvasRef} className={className} style={{ display: "none" }} />;
}
