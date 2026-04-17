const CLOUDFRONT_HOST = "https://d1xzxglpo1zn8i.cloudfront.net";
const S3_PREFIX = "upsc-notes-pdfs";

export function buildCloudFrontUrl(dbPath: string): string {
  const encoded = dbPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${CLOUDFRONT_HOST}/${S3_PREFIX}/${encoded}`;
}
