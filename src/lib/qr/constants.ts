import {
  DotType,
  CornerSquareType,
  CornerDotType,
  ErrorCorrectionLevel,
  QRDesignConfig,
} from "@/types/qr";

export const DEFAULT_DESIGN: QRDesignConfig = {
  dotType: "rounded",
  dotsColor: "#0F172A",
  backgroundColor: "#FFFFFF",
  cornersSquareType: "extra-rounded",
  cornersSquareColor: "#0F172A",
  cornersDotType: "dot",
  cornersDotColor: "#0F172A",
  customEyeColors: false,
  margin: 10,
  errorCorrectionLevel: "Q",
  logoUrl: null,
  logoSize: 0.3,
  logoMargin: 6,
};

export const COLOR_PRESETS = [
  { name: "Obsidian", fg: "#0F172A", bg: "#FFFFFF" },
  { name: "Brand Blue", fg: "#2563EB", bg: "#FFFFFF" },
  { name: "Emerald", fg: "#059669", bg: "#FFFFFF" },
  { name: "Royal Purple", fg: "#7C3AED", bg: "#FFFFFF" },
  { name: "Crimson", fg: "#DC2626", bg: "#FFFFFF" },
  { name: "Dark Modern", fg: "#F8FAFC", bg: "#0F172A" },
  { name: "Cyberpunk", fg: "#06B6D4", bg: "#0F172A" },
  { name: "Warm Gold", fg: "#D97706", bg: "#FFFBEB" },
];

export const DOT_OPTIONS: { id: DotType; label: string }[] = [
  { id: "square", label: "Square" },
  { id: "rounded", label: "Rounded" },
  { id: "dots", label: "Dots" },
  { id: "extra-rounded", label: "Extra Rounded" },
  { id: "classy", label: "Classy" },
  { id: "classy-rounded", label: "Classy Rounded" },
];

export const CORNER_SQUARE_OPTIONS: { id: CornerSquareType; label: string }[] = [
  { id: "square", label: "Square" },
  { id: "extra-rounded", label: "Extra Rounded" },
  { id: "dot", label: "Circle" },
];

export const CORNER_DOT_OPTIONS: { id: CornerDotType; label: string }[] = [
  { id: "square", label: "Square" },
  { id: "dot", label: "Dot" },
];

export const ERROR_CORRECTION_OPTIONS: {
  level: ErrorCorrectionLevel;
  label: string;
  recovery: string;
  description: string;
}[] = [
  { level: "L", label: "Low (7%)", recovery: "7%", description: "Smallest size, clean look" },
  { level: "M", label: "Medium (15%)", recovery: "15%", description: "Balanced standard" },
  { level: "Q", label: "Quartile (25%)", recovery: "25%", description: "Recommended for outdoor or busy backgrounds" },
  { level: "H", label: "High (30%)", recovery: "30%", description: "Required for logos & heavy customization" },
];

// Curated SVG Preset Logos as clean Data URIs for instant 1-click addition
export const PRESET_LOGOS = [
  {
    id: "qr-studio",
    name: "Studio",
    dataUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Crect width='100' height='100' rx='24' fill='%232563EB'/%3E%3Cpath d='M30 30h16v16H30zm0 24h16v16H30zm24-24h16v16H54zm12 24h4v4h-4zm-8 4h4v4h-4zm4 4h4v4h-4zm-8 4h4v4h-4z' fill='%23fff'/%3E%3C/svg%3E",
  },
  {
    id: "website",
    name: "Globe",
    dataUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Crect width='100' height='100' rx='50' fill='%232563EB'/%3E%3Ccircle cx='50' cy='50' r='30' stroke='%23fff' stroke-width='6'/%3E%3Cellipse cx='50' cy='50' rx='14' ry='30' stroke='%23fff' stroke-width='6'/%3E%3Cpath d='M20 50h60' stroke='%23fff' stroke-width='6'/%3E%3C/svg%3E",
  },
  {
    id: "wifi",
    name: "Wi-Fi",
    dataUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Crect width='100' height='100' rx='50' fill='%23059669'/%3E%3Cpath d='M22 38c16-14 40-14 56 0M32 50c10-9 26-9 36 0M42 62c5-4 11-4 16 0' stroke='%23fff' stroke-width='7' stroke-linecap='round'/%3E%3Ccircle cx='50' cy='74' r='4' fill='%23fff'/%3E%3C/svg%3E",
  },
  {
    id: "email",
    name: "Email",
    dataUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Crect width='100' height='100' rx='24' fill='%23EA580C'/%3E%3Crect x='22' y='30' width='56' height='40' rx='6' stroke='%23fff' stroke-width='6'/%3E%3Cpath d='M24 33l26 20 26-20' stroke='%23fff' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E",
  },
];

export const INITIAL_FORM_DATA: {
  url: import("@/types/qr").URLFormData;
  text: import("@/types/qr").TextFormData;
  wifi: import("@/types/qr").WifiFormData;
  email: import("@/types/qr").EmailFormData;
  phone: import("@/types/qr").PhoneFormData;
  sms: import("@/types/qr").SMSFormData;
} = {
  url: { url: "https://qrstudio.app" },
  text: { text: "Hello from QR Studio! Scan me for instant access." },
  wifi: { ssid: "Studio_Guest_WiFi", password: "Password123!", encryption: "WPA", hidden: false },
  email: { email: "hello@qrstudio.app", subject: "Hello QR Studio", body: "I'd like to get in touch with you." },
  phone: { phone: "+1 415 555 2671" },
  sms: { phone: "+1 415 555 2671", message: "Hi, I scanned your QR code!" },
};
