export type ActiveQRType = "url" | "text" | "wifi" | "email" | "phone" | "sms";
export type FutureQRType = "vcard" | "event" | "geo";
export type QRType = ActiveQRType | FutureQRType;

export interface URLFormData {
  url: string;
}

export interface TextFormData {
  text: string;
}

export type WifiEncryption = "WPA" | "WEP" | "nopass";

export interface WifiFormData {
  ssid: string;
  password?: string;
  encryption: WifiEncryption;
  hidden: boolean;
}

export interface EmailFormData {
  email: string;
  subject?: string;
  body?: string;
}

export interface PhoneFormData {
  phone: string;
}

export interface SMSFormData {
  phone: string;
  message?: string;
}

export interface VCardFormData {
  firstName: string;
  lastName: string;
  organization?: string;
  title?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
}

export interface EventFormData {
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface GeoFormData {
  latitude: number;
  longitude: number;
  query?: string;
}

export type QRFormDataMap = {
  url: URLFormData;
  text: TextFormData;
  wifi: WifiFormData;
  email: EmailFormData;
  phone: PhoneFormData;
  sms: SMSFormData;
  vcard: VCardFormData;
  event: EventFormData;
  geo: GeoFormData;
};

export type DotType = "dots" | "rounded" | "classy" | "classy-rounded" | "square" | "extra-rounded";
export type CornerSquareType = "square" | "dot" | "extra-rounded";
export type CornerDotType = "square" | "dot";
export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QRDesignConfig {
  dotType: DotType;
  dotsColor: string;
  backgroundColor: string;
  cornersSquareType: CornerSquareType;
  cornersSquareColor: string;
  cornersDotType: CornerDotType;
  cornersDotColor: string;
  customEyeColors: boolean;
  margin: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  logoUrl: string | null;
  logoSize: number;
  logoMargin: number;
}

export type ExportFormat = "png" | "svg";
export type ExportResolution = 512 | 1024 | 2048;

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export type QRMode = "static" | "dynamic";
export type QRStatus = "active" | "paused" | "archived";
export type WorkspaceRole = "owner" | "admin" | "member";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  created_at: string;
}

export interface Folder {
  id: string;
  workspace_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface SavedQRPayload<K extends ActiveQRType = ActiveQRType> {
  rawPayload: string;
  detail: string;
  formData: QRFormDataMap[K];
}

export interface SavedQRCode {
  id: string;
  workspace_id: string;
  folder_id: string | null;
  name: string;
  type: ActiveQRType;
  mode: QRMode;
  slug: string | null;
  destination_url: string | null;
  payload: SavedQRPayload;
  design: QRDesignConfig;
  status: QRStatus;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

