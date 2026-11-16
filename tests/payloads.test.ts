import { describe, it, expect } from "vitest";
import {
  encodeURLPayload,
  encodeTextPayload,
  encodeWifiPayload,
  encodeEmailPayload,
  encodePhonePayload,
  encodeSMSPayload,
  escapeWifiString,
  cleanPhoneNumber,
} from "@/lib/qr/payloads";

describe("QR Payload Encoders", () => {
  describe("URL Encoder", () => {
    it("should prepend https:// if missing", () => {
      expect(encodeURLPayload({ url: "google.com" })).toBe("https://google.com");
    });

    it("should preserve existing https:// protocol", () => {
      expect(encodeURLPayload({ url: "https://stripe.com/docs" })).toBe(
        "https://stripe.com/docs"
      );
    });

    it("should preserve existing http:// protocol", () => {
      expect(encodeURLPayload({ url: "http://localhost:3000" })).toBe(
        "http://localhost:3000"
      );
    });

    it("should reject dangerous schemes like javascript:", () => {
      expect(encodeURLPayload({ url: "javascript:alert(1)" })).toBe("");
      expect(encodeURLPayload({ url: "data:text/html,<script>" })).toBe("");
    });
  });

  describe("Text Encoder", () => {
    it("should encode plain text as is", () => {
      expect(encodeTextPayload({ text: "Hello Antigravity!" })).toBe(
        "Hello Antigravity!"
      );
    });
  });

  describe("Wi-Fi Encoder", () => {
    it("should escape special characters in SSID and password", () => {
      expect(escapeWifiString('My;SSID\\with"quotes')).toBe(
        'My\\;SSID\\\\with\\"quotes'
      );
    });

    it("should encode WPA Wi-Fi with password", () => {
      const payload = encodeWifiPayload({
        ssid: "OfficeGuest",
        password: "Secret;Password",
        encryption: "WPA",
        hidden: false,
      });
      expect(payload).toBe(
        "WIFI:T:WPA;S:OfficeGuest;P:Secret\\;Password;H:false;;"
      );
    });

    it("should omit password for nopass open networks", () => {
      const payload = encodeWifiPayload({
        ssid: "FreePublicWiFi",
        encryption: "nopass",
        hidden: true,
      });
      expect(payload).toBe("WIFI:T:nopass;S:FreePublicWiFi;H:true;;");
    });
  });

  describe("Email Encoder", () => {
    it("should format mailto with subject and body correctly", () => {
      const payload = encodeEmailPayload({
        email: "support@qrstudio.app",
        subject: "Need Assistance",
        body: "Hello Support Team",
      });
      expect(payload).toBe(
        "mailto:support@qrstudio.app?subject=Need%20Assistance&body=Hello%20Support%20Team"
      );
    });

    it("should format mailto with email only", () => {
      expect(encodeEmailPayload({ email: "hello@qrstudio.app" })).toBe(
        "mailto:hello@qrstudio.app"
      );
    });
  });

  describe("Phone Encoder", () => {
    it("should clean phone numbers and format with tel:", () => {
      expect(cleanPhoneNumber("+1 (555) 234-5678")).toBe("+15552345678");
      expect(encodePhonePayload({ phone: "+1 (555) 234-5678" })).toBe(
        "tel:+15552345678"
      );
    });
  });

  describe("SMS Encoder", () => {
    it("should format SMS using smsto: scheme", () => {
      const payload = encodeSMSPayload({
        phone: "+1 415 555 1234",
        message: "Hello there!",
      });
      expect(payload).toBe("smsto:+14155551234:Hello there!");
    });
  });
});
