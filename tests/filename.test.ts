import { describe, it, expect } from "vitest";
import { generateQRFilename } from "@/lib/qr/filename";

describe("QR Filename Generator", () => {
  it("should create sanitized filename for URL", () => {
    const filename = generateQRFilename("url", "https://linear.app/docs", "png");
    expect(filename).toBe("qr-studio-url-linearapp.png");
  });

  it("should create sanitized filename for Wi-Fi SSID", () => {
    const filename = generateQRFilename("wifi", "Coffee & Cake 5G!", "svg");
    expect(filename).toBe("qr-studio-wifi-coffee-cake-5g.svg");
  });

  it("should create sanitized filename for email", () => {
    const filename = generateQRFilename("email", "john.doe@example.com", "png");
    expect(filename).toBe("qr-studio-email-johndoe.png");
  });

  it("should handle empty or special characters gracefully", () => {
    const filename = generateQRFilename("text", "###", "png");
    expect(filename).toBe("qr-studio-text.png");
  });
});
