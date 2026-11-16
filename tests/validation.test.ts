import { describe, it, expect } from "vitest";
import { validateQRData } from "@/lib/qr/validation";

describe("QR Validation Schemas", () => {
  it("should validate URLs and reject invalid/dangerous strings", () => {
    expect(validateQRData("url", { url: "https://stripe.com" }).isValid).toBe(true);
    expect(validateQRData("url", { url: "example.com" }).isValid).toBe(true);
    expect(validateQRData("url", { url: "" }).isValid).toBe(false);
    expect(validateQRData("url", { url: "javascript:alert(1)" }).isValid).toBe(false);
  });

  it("should validate text content", () => {
    expect(validateQRData("text", { text: "Some notes" }).isValid).toBe(true);
    expect(validateQRData("text", { text: "" }).isValid).toBe(false);
  });

  it("should validate Wi-Fi configurations", () => {
    expect(
      validateQRData("wifi", {
        ssid: "MyHomeNet",
        password: "securepassword",
        encryption: "WPA",
        hidden: false,
      }).isValid
    ).toBe(true);

    // WPA requires at least 8 chars
    expect(
      validateQRData("wifi", {
        ssid: "MyHomeNet",
        password: "short",
        encryption: "WPA",
        hidden: false,
      }).isValid
    ).toBe(false);

    // Open network doesn't require password
    expect(
      validateQRData("wifi", {
        ssid: "OpenCafe",
        encryption: "nopass",
        hidden: true,
      }).isValid
    ).toBe(true);
  });

  it("should validate email format", () => {
    expect(
      validateQRData("email", { email: "contact@qrstudio.app" }).isValid
    ).toBe(true);
    expect(validateQRData("email", { email: "not-an-email" }).isValid).toBe(
      false
    );
  });

  it("should validate phone format", () => {
    expect(validateQRData("phone", { phone: "+1 555 123 4567" }).isValid).toBe(
      true
    );
    expect(validateQRData("phone", { phone: "abc" }).isValid).toBe(false);
  });

  it("should validate SMS payload format", () => {
    expect(
      validateQRData("sms", {
        phone: "+44 20 7946 0991",
        message: "Confirmation code",
      }).isValid
    ).toBe(true);
    expect(validateQRData("sms", { phone: "12" }).isValid).toBe(false);
  });
});
