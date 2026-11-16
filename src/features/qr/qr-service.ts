import { z } from "zod";
import {
  ActiveQRType,
  QRDesignConfig,
  QRFormDataMap,
  SavedQRCode,
  Folder,
  Workspace,
  UserProfile,
} from "@/types/qr";
import { validateQRData } from "@/lib/qr/validation";

export const qrDesignSchema = z.object({
  dotType: z.enum(["dots", "rounded", "classy", "classy-rounded", "square", "extra-rounded"]),
  dotsColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid foreground hex color"),
  backgroundColor: z.string(),
  cornersSquareType: z.enum(["square", "dot", "extra-rounded"]),
  cornersSquareColor: z.string(),
  cornersDotType: z.enum(["square", "dot"]),
  cornersDotColor: z.string(),
  customEyeColors: z.boolean(),
  margin: z.number().min(0).max(50),
  errorCorrectionLevel: z.enum(["L", "M", "Q", "H"]),
  logoUrl: z.string().nullable(),
  logoSize: z.number().min(0.1).max(0.6),
  logoMargin: z.number().min(0).max(30),
});

export const saveQRInputSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspace ID"),
  folderId: z.string().uuid("Invalid folder ID").nullable().optional(),
  name: z
    .string()
    .trim()
    .min(1, "QR code name is required")
    .max(100, "Name cannot exceed 100 characters"),
  type: z.enum(["url", "text", "wifi", "email", "phone", "sms"]),
  rawPayload: z.string().min(1, "Encoded payload cannot be empty"),
  detail: z.string(),
  formData: z.record(z.string(), z.unknown()),
  design: qrDesignSchema,
});

export const folderInputSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspace ID"),
  name: z
    .string()
    .trim()
    .min(1, "Folder name is required")
    .max(50, "Folder name cannot exceed 50 characters"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color hex").default("#2563EB"),
});

export const profileUpdateSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(80, "Full name cannot exceed 80 characters"),
  workspaceName: z
    .string()
    .trim()
    .min(1, "Workspace name is required")
    .max(80, "Workspace name cannot exceed 80 characters")
    .optional(),
});

export interface SaveQRRecordParams<K extends ActiveQRType = ActiveQRType> {
  workspaceId: string;
  folderId?: string | null;
  name: string;
  type: K;
  rawPayload: string;
  detail: string;
  formData: QRFormDataMap[K];
  design: QRDesignConfig;
}

/**
 * Validates and prepares a clean database record for inserting/updating in `public.qr_codes`.
 * Never trusts unvalidated payloads.
 */
export function buildQRDatabaseRecord<K extends ActiveQRType>(
  params: SaveQRRecordParams<K>
) {
  const parsed = saveQRInputSchema.safeParse({
    ...params,
    folderId: params.folderId ?? null,
  });

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    throw new Error(firstIssue?.message || "Invalid QR code configuration");
  }

  // Validate type-specific form data
  const contentValidation = validateQRData(params.type, params.formData);
  if (!contentValidation.isValid) {
    const firstError = Object.values(contentValidation.errors)[0];
    throw new Error(firstError || "Invalid QR content fields");
  }

  return {
    workspace_id: parsed.data.workspaceId,
    folder_id: parsed.data.folderId ?? null,
    name: parsed.data.name,
    type: parsed.data.type,
    mode: "static" as const,
    status: "active" as const,
    payload: {
      rawPayload: parsed.data.rawPayload,
      detail: parsed.data.detail,
      formData: params.formData,
    },
    design: parsed.data.design,
  };
}

/**
 * Formats a duplicate QR code record with "(Copy)" appended to its name.
 */
export function buildDuplicateQRRecord(existing: SavedQRCode) {
  const copyName = existing.name.endsWith("(Copy)")
    ? `${existing.name} 2`
    : `${existing.name} (Copy)`;

  return {
    workspace_id: existing.workspace_id,
    folder_id: existing.folder_id,
    name: copyName.slice(0, 100),
    type: existing.type,
    mode: existing.mode,
    status: existing.status,
    payload: existing.payload,
    design: existing.design,
  };
}

/**
 * Filters a list of saved QR codes by search query, type, and folder ID.
 */
export function filterSavedQRCodes(
  codes: SavedQRCode[],
  options: {
    search?: string;
    type?: ActiveQRType | "all";
    folderId?: string | "all" | "unfiled";
  }
): SavedQRCode[] {
  const query = (options.search || "").trim().toLowerCase();
  const filterType = options.type || "all";
  const filterFolder = options.folderId || "all";

  return codes.filter((qr) => {
    if (filterType !== "all" && qr.type !== filterType) {
      return false;
    }

    if (filterFolder === "unfiled" && qr.folder_id !== null) {
      return false;
    } else if (
      filterFolder !== "all" &&
      filterFolder !== "unfiled" &&
      qr.folder_id !== filterFolder
    ) {
      return false;
    }

    if (query) {
      const nameMatch = qr.name.toLowerCase().includes(query);
      const detailMatch = (qr.payload?.detail || "").toLowerCase().includes(query);
      const rawMatch = (qr.payload?.rawPayload || "").toLowerCase().includes(query);
      const typeMatch = qr.type.toLowerCase().includes(query);
      return nameMatch || detailMatch || rawMatch || typeMatch;
    }

    return true;
  });
}

export type { SavedQRCode, Folder, Workspace, UserProfile };

