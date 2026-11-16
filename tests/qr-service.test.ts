import { describe, it, expect } from "vitest";
import {
  buildQRDatabaseRecord,
  buildDuplicateQRRecord,
  filterSavedQRCodes,
  folderInputSchema,
  profileUpdateSchema,
} from "@/features/qr/qr-service";
import { DEFAULT_DESIGN } from "@/lib/qr/constants";
import { SavedQRCode } from "@/types/qr";

const VALID_WORKSPACE_ID = "123e4567-e89b-12d3-a456-426614174000";
const VALID_FOLDER_ID = "987e6543-e21b-12d3-a456-426614174111";

describe("Phase 2 — QR Service & Workspace Validation", () => {
  describe("buildQRDatabaseRecord", () => {
    it("should build a valid database payload for a URL QR code", () => {
      const record = buildQRDatabaseRecord({
        workspaceId: VALID_WORKSPACE_ID,
        folderId: VALID_FOLDER_ID,
        name: "Marketing Landing Page",
        type: "url",
        rawPayload: "https://qrstudio.app/promo",
        detail: "https://qrstudio.app/promo",
        formData: { url: "https://qrstudio.app/promo" },
        design: DEFAULT_DESIGN,
      });

      expect(record.workspace_id).toBe(VALID_WORKSPACE_ID);
      expect(record.folder_id).toBe(VALID_FOLDER_ID);
      expect(record.name).toBe("Marketing Landing Page");
      expect(record.mode).toBe("static");
      expect(record.status).toBe("active");
      expect(record.payload.rawPayload).toBe("https://qrstudio.app/promo");
    });

    it("should reject non-UUID workspace IDs to prevent spoofed ownership", () => {
      expect(() =>
        buildQRDatabaseRecord({
          workspaceId: "malicious-id",
          name: "Test QR",
          type: "url",
          rawPayload: "https://example.com",
          detail: "https://example.com",
          formData: { url: "https://example.com" },
          design: DEFAULT_DESIGN,
        })
      ).toThrow(/Invalid workspace ID/i);
    });

    it("should reject dangerous URL schemes in saved QR payloads", () => {
      expect(() =>
        buildQRDatabaseRecord({
          workspaceId: VALID_WORKSPACE_ID,
          name: "Bad Script QR",
          type: "url",
          rawPayload: "javascript:alert(1)",
          detail: "javascript:alert(1)",
          formData: { url: "javascript:alert(1)" },
          design: DEFAULT_DESIGN,
        })
      ).toThrow(/Dangerous URL scheme/i);
    });

    it("should reject empty QR code names", () => {
      expect(() =>
        buildQRDatabaseRecord({
          workspaceId: VALID_WORKSPACE_ID,
          name: "   ",
          type: "text",
          rawPayload: "Hello",
          detail: "Hello",
          formData: { text: "Hello" },
          design: DEFAULT_DESIGN,
        })
      ).toThrow(/QR code name is required/i);
    });
  });

  describe("buildDuplicateQRRecord", () => {
    const sampleQR: SavedQRCode = {
      id: "222e4567-e89b-12d3-a456-426614174222",
      workspace_id: VALID_WORKSPACE_ID,
      folder_id: VALID_FOLDER_ID,
      name: "Cafe Guest Wi-Fi",
      type: "wifi",
      mode: "static",
      slug: null,
      destination_url: null,
      payload: {
        rawPayload: "WIFI:T:WPA;S:CafeGuest;P:secret1234;H:false;;",
        detail: "CafeGuest",
        formData: {
          ssid: "CafeGuest",
          password: "secret1234",
          encryption: "WPA",
          hidden: false,
        },
      },
      design: DEFAULT_DESIGN,
      status: "active",
      expires_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    it("should append (Copy) and preserve workspace, folder, payload, and design", () => {
      const dup = buildDuplicateQRRecord(sampleQR);
      expect(dup.name).toBe("Cafe Guest Wi-Fi (Copy)");
      expect(dup.workspace_id).toBe(VALID_WORKSPACE_ID);
      expect(dup.folder_id).toBe(VALID_FOLDER_ID);
      expect(dup.payload.detail).toBe("CafeGuest");
      expect(dup.design.dotsColor).toBe(DEFAULT_DESIGN.dotsColor);
    });

    it("should increment copy suffix if already ending in (Copy)", () => {
      const secondDup = buildDuplicateQRRecord({
        ...sampleQR,
        name: "Cafe Guest Wi-Fi (Copy)",
      });
      expect(secondDup.name).toBe("Cafe Guest Wi-Fi (Copy) 2");
    });
  });

  describe("filterSavedQRCodes", () => {
    const mockList: SavedQRCode[] = [
      {
        id: "1",
        workspace_id: VALID_WORKSPACE_ID,
        folder_id: VALID_FOLDER_ID,
        name: "Main Website",
        type: "url",
        mode: "static",
        slug: null,
        destination_url: null,
        payload: {
          rawPayload: "https://stripe.com",
          detail: "https://stripe.com",
          formData: { url: "https://stripe.com" },
        },
        design: DEFAULT_DESIGN,
        status: "active",
        expires_at: null,
        created_at: "2026-10-12T00:00:00Z",
        updated_at: "2026-10-12T00:00:00Z",
      },
      {
        id: "2",
        workspace_id: VALID_WORKSPACE_ID,
        folder_id: null,
        name: "Lobby Wi-Fi",
        type: "wifi",
        mode: "static",
        slug: null,
        destination_url: null,
        payload: {
          rawPayload: "WIFI:T:WPA;S:LobbyNet;P:12345678;H:false;;",
          detail: "LobbyNet",
          formData: {
            ssid: "LobbyNet",
            password: "12345678",
            encryption: "WPA",
            hidden: false,
          },
        },
        design: DEFAULT_DESIGN,
        status: "active",
        expires_at: null,
        created_at: "2026-10-12T00:00:00Z",
        updated_at: "2026-10-12T00:00:00Z",
      },
    ];

    it("should filter by search query across name and payload detail", () => {
      expect(filterSavedQRCodes(mockList, { search: "stripe" })).toHaveLength(1);
      expect(filterSavedQRCodes(mockList, { search: "Lobby" })).toHaveLength(1);
      expect(filterSavedQRCodes(mockList, { search: "nonexistent" })).toHaveLength(0);
    });

    it("should filter by QR type", () => {
      expect(filterSavedQRCodes(mockList, { type: "wifi" })).toHaveLength(1);
      expect(filterSavedQRCodes(mockList, { type: "email" })).toHaveLength(0);
    });

    it("should filter by folder or unfiled status", () => {
      expect(
        filterSavedQRCodes(mockList, { folderId: VALID_FOLDER_ID })
      ).toHaveLength(1);
      expect(filterSavedQRCodes(mockList, { folderId: "unfiled" })).toHaveLength(
        1
      );
      expect(filterSavedQRCodes(mockList, { folderId: "all" })).toHaveLength(2);
    });
  });

  describe("Folder & Profile Validation", () => {
    it("should validate folder creation input", () => {
      const valid = folderInputSchema.safeParse({
        workspaceId: VALID_WORKSPACE_ID,
        name: "Client Campaigns",
        color: "#2563EB",
      });
      expect(valid.success).toBe(true);

      const invalid = folderInputSchema.safeParse({
        workspaceId: VALID_WORKSPACE_ID,
        name: "",
        color: "not-a-hex",
      });
      expect(invalid.success).toBe(false);
    });

    it("should validate profile and workspace update input", () => {
      expect(
        profileUpdateSchema.safeParse({
          fullName: "Dilip Charuka",
          workspaceName: "Dilip Studio",
        }).success
      ).toBe(true);

      expect(
        profileUpdateSchema.safeParse({
          fullName: "",
        }).success
      ).toBe(false);
    });
  });
});

