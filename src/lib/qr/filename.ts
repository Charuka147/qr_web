import { ActiveQRType, ExportFormat } from "@/types/qr";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 30);
}

export function generateQRFilename(
  type: ActiveQRType,
  detail: string,
  extension: ExportFormat
): string {
  let descriptor = "";

  if (type === "url") {
    try {
      const url = /^https?:\/\//i.test(detail) ? new URL(detail) : new URL(`https://${detail}`);
      descriptor = slugify(url.hostname);
    } catch {
      descriptor = slugify(detail);
    }
  } else if (type === "wifi") {
    descriptor = slugify(detail);
  } else if (type === "email") {
    descriptor = slugify(detail.split("@")[0] || "mail");
  } else if (type === "phone" || type === "sms") {
    descriptor = slugify(detail.replace(/[^\d]/g, ""));
  } else {
    descriptor = slugify(detail.slice(0, 20));
  }

  const cleanDescriptor = descriptor ? `-${descriptor}` : "";
  return `qr-studio-${type}${cleanDescriptor}.${extension}`;
}
