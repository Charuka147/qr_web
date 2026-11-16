import {
  URLFormData,
  TextFormData,
  WifiFormData,
  EmailFormData,
  PhoneFormData,
  SMSFormData,
  VCardFormData,
  EventFormData,
  GeoFormData,
} from "@/types/qr";

/**
 * Escapes characters reserved in Wi-Fi MECARD format: \ ; , : "
 */
export function escapeWifiString(str: string): string {
  return str.replace(/([\\;,:"'])/g, "\\$1");
}

/**
 * Normalizes and validates URL safe protocol
 */
export function encodeURLPayload(data: URLFormData): string {
  const trimmed = data.url.trim();
  if (!trimmed) return "";

  // Prevent dangerous schemes
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:")
  ) {
    return "";
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

/**
 * Encodes plain text
 */
export function encodeTextPayload(data: TextFormData): string {
  return data.text;
}

/**
 * Encodes Wi-Fi network payload following standard MECARD WIFI specification:
 * WIFI:T:WPA;S:MySSID;P:MyPassword;H:false;;
 */
export function encodeWifiPayload(data: WifiFormData): string {
  const ssid = escapeWifiString(data.ssid.trim());
  if (!ssid) return "";

  const encType = data.encryption || "WPA";
  let payload = `WIFI:T:${encType};S:${ssid};`;

  if (encType !== "nopass" && data.password) {
    payload += `P:${escapeWifiString(data.password)};`;
  }

  payload += `H:${data.hidden ? "true" : "false"};;`;
  return payload;
}

/**
 * Encodes mailto link with optional subject and body
 */
export function encodeEmailPayload(data: EmailFormData): string {
  const email = data.email.trim();
  if (!email) return "";

  const params: string[] = [];
  if (data.subject?.trim()) {
    params.push(`subject=${encodeURIComponent(data.subject.trim())}`);
  }
  if (data.body?.trim()) {
    params.push(`body=${encodeURIComponent(data.body.trim())}`);
  }

  if (params.length > 0) {
    return `mailto:${email}?${params.join("&")}`;
  }
  return `mailto:${email}`;
}

/**
 * Normalizes phone number into standard tel: URI
 */
export function cleanPhoneNumber(phone: string): string {
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/[^\d]/g, "");
  return hasPlus ? `+${digits}` : digits;
}

export function encodePhonePayload(data: PhoneFormData): string {
  const cleaned = cleanPhoneNumber(data.phone);
  if (!cleaned) return "";
  return `tel:${cleaned}`;
}

/**
 * Encodes SMS link using widely-compatible smsto: format
 */
export function encodeSMSPayload(data: SMSFormData): string {
  const cleaned = cleanPhoneNumber(data.phone);
  if (!cleaned) return "";

  const message = data.message ? data.message.trim() : "";
  return `smsto:${cleaned}:${message}`;
}

/**
 * Prepared architecture for future vCard format (vCard 3.0)
 */
export function encodeVCardPayload(data: VCardFormData): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${data.lastName};${data.firstName};;;`,
    `FN:${data.firstName} ${data.lastName}`.trim(),
  ];

  if (data.organization) lines.push(`ORG:${data.organization}`);
  if (data.title) lines.push(`TITLE:${data.title}`);
  if (data.phone) lines.push(`TEL;TYPE=CELL:${cleanPhoneNumber(data.phone)}`);
  if (data.email) lines.push(`EMAIL;TYPE=INTERNET:${data.email.trim()}`);
  if (data.website) lines.push(`URL:${encodeURLPayload({ url: data.website })}`);
  if (data.address) lines.push(`ADR;TYPE=WORK:;;${data.address};;;;`);

  lines.push("END:VCARD");
  return lines.join("\n");
}

/**
 * Prepared architecture for Calendar Event
 */
export function encodeEventPayload(data: EventFormData): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:${data.title}`,
  ];
  if (data.location) lines.push(`LOCATION:${data.location}`);
  if (data.startDate) lines.push(`DTSTART:${data.startDate.replace(/[-:]/g, "")}`);
  if (data.endDate) lines.push(`DTEND:${data.endDate.replace(/[-:]/g, "")}`);
  if (data.description) lines.push(`DESCRIPTION:${data.description}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\n");
}

/**
 * Prepared architecture for Geolocation
 */
export function encodeGeoPayload(data: GeoFormData): string {
  if (data.query) {
    return `geo:${data.latitude},${data.longitude}?q=${encodeURIComponent(data.query)}`;
  }
  return `geo:${data.latitude},${data.longitude}`;
}
