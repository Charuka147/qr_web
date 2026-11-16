import { z } from "zod";
import {
  ActiveQRType,
  ValidationResult,
} from "@/types/qr";

const phoneRegex = /^\+?[0-9\s\-().]{6,20}$/;

export const urlSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .refine((val) => {
      const lower = val.trim().toLowerCase();
      return (
        !lower.startsWith("javascript:") &&
        !lower.startsWith("data:") &&
        !lower.startsWith("vbscript:")
      );
    }, "Dangerous URL scheme detected")
    .refine((val) => {
      try {
        const testUrl = /^https?:\/\//i.test(val) ? val : `https://${val}`;
        new URL(testUrl);
        return true;
      } catch {
        return false;
      }
    }, "Please enter a valid website URL"),
});

export const textSchema = z.object({
  text: z
    .string()
    .min(1, "Text content is required")
    .max(2000, "Maximum recommended length for scannable QR is 2000 characters"),
});

export const wifiSchema = z
  .object({
    ssid: z
      .string()
      .min(1, "Network name (SSID) is required")
      .max(32, "SSID cannot exceed 32 characters"),
    password: z.string().optional(),
    encryption: z.enum(["WPA", "WEP", "nopass"]),
    hidden: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.encryption === "WPA") {
      if (!data.password || data.password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "WPA/WPA2 networks require a password of at least 8 characters",
        });
      }
    } else if (data.encryption === "WEP") {
      if (!data.password || data.password.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "WEP networks require a password of at least 5 characters",
        });
      }
    }
  });

export const emailSchema = z.object({
  email: z.string().min(1, "Email address is required").email("Please enter a valid email address"),
  subject: z.string().max(200, "Subject cannot exceed 200 characters").optional(),
  body: z.string().max(1000, "Body cannot exceed 1000 characters").optional(),
});

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(phoneRegex, "Please enter a valid phone number (e.g., +1 234 567 8900)"),
});

export const smsSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(phoneRegex, "Please enter a valid phone number (e.g., +1 234 567 8900)"),
  message: z.string().max(500, "SMS message cannot exceed 500 characters").optional(),
});

export function validateQRData(
  type: ActiveQRType,
  data: unknown
): ValidationResult {
  let schema: z.ZodTypeAny;

  switch (type) {
    case "url":
      schema = urlSchema;
      break;
    case "text":
      schema = textSchema;
      break;
    case "wifi":
      schema = wifiSchema;
      break;
    case "email":
      schema = emailSchema;
      break;
    case "phone":
      schema = phoneSchema;
      break;
    case "sms":
      schema = smsSchema;
      break;
    default:
      return { isValid: true, errors: {} };
  }

  const result = schema.safeParse(data);
  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0]?.toString() || "form";
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }

  return { isValid: false, errors };
}
