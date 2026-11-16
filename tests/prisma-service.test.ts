import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getWorkspaceQRCodes,
  createQRCodePrisma,
  duplicateQRCodePrisma,
  deleteQRCodePrisma,
  createFolderPrisma,
  deleteFolderPrisma,
} from "@/features/qr/prisma-service";
import { prisma } from "@/lib/prisma";

// Mock the prisma client
vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      qrCode: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
        delete: vi.fn(),
      },
      folder: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
      },
    },
    getPrismaClient: vi.fn(),
  };
});

describe("Prisma Service (Server-side Tenant-Scoped Operations)", () => {
  const dummyWorkspaceId = "11111111-1111-4111-8111-111111111111";
  const dummyQrId = "22222222-2222-4222-8222-222222222222";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("enforces workspaceId in getWorkspaceQRCodes query", async () => {
    const mockFindMany = vi.mocked(prisma.qrCode.findMany);
    mockFindMany.mockResolvedValueOnce([
      {
        id: dummyQrId,
        workspaceId: dummyWorkspaceId,
        folderId: null,
        name: "Website QR",
        type: "url",
        mode: "static",
        slug: null,
        destinationUrl: null,
        payload: {
          rawPayload: "https://example.com",
          detail: "https://example.com",
          formData: { url: "https://example.com" },
        },
        design: {
          dotType: "square",
          dotsColor: "#000000",
          backgroundColor: "#ffffff",
          cornersSquareType: "square",
          cornersSquareColor: "#000000",
          cornersDotType: "square",
          cornersDotColor: "#000000",
          customEyeColors: false,
          margin: 10,
          errorCorrectionLevel: "M",
          logoUrl: null,
          logoSize: 0.3,
          logoMargin: 4,
        },
        status: "active",
        expiresAt: null,
        createdAt: new Date("2026-01-01T00:00:00Z"),
        updatedAt: new Date("2026-01-01T00:00:00Z"),
      },
    ]);

    const result = await getWorkspaceQRCodes(dummyWorkspaceId, {
      type: "url",
      search: "Web",
    });

    expect(mockFindMany).toHaveBeenCalledWith({
      where: {
        workspaceId: dummyWorkspaceId,
        type: "url",
        name: { contains: "Web", mode: "insensitive" },
      },
      orderBy: { createdAt: "desc" },
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Website QR");
    expect(result[0].workspace_id).toBe(dummyWorkspaceId);
  });

  it("validates and creates a new QR code scoped to workspace", async () => {
    const mockCreate = vi.mocked(prisma.qrCode.create);
    mockCreate.mockResolvedValueOnce({
      id: dummyQrId,
      workspaceId: dummyWorkspaceId,
      folderId: null,
      name: "My Promo",
      type: "url",
      mode: "static",
      slug: null,
      destinationUrl: null,
      payload: {
        rawPayload: "https://mysite.com",
        detail: "https://mysite.com",
        formData: { url: "https://mysite.com" },
      },
      design: {
        dotType: "dots",
        dotsColor: "#2563EB",
        backgroundColor: "#ffffff",
        cornersSquareType: "extra-rounded",
        cornersSquareColor: "#2563EB",
        cornersDotType: "dot",
        cornersDotColor: "#2563EB",
        customEyeColors: false,
        margin: 10,
        errorCorrectionLevel: "M",
        logoUrl: null,
        logoSize: 0.3,
        logoMargin: 4,
      },
      status: "active",
      expiresAt: null,
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-01-01T00:00:00Z"),
    });

    const result = await createQRCodePrisma({
      workspaceId: dummyWorkspaceId,
      name: "My Promo",
      type: "url",
      rawPayload: "https://mysite.com",
      detail: "https://mysite.com",
      formData: { url: "https://mysite.com" },
      design: {
        dotType: "dots",
        dotsColor: "#2563EB",
        backgroundColor: "#ffffff",
        cornersSquareType: "extra-rounded",
        cornersSquareColor: "#2563EB",
        cornersDotType: "dot",
        cornersDotColor: "#2563EB",
        customEyeColors: false,
        margin: 10,
        errorCorrectionLevel: "M",
        logoUrl: null,
        logoSize: 0.3,
        logoMargin: 4,
      },
    });

    expect(mockCreate).toHaveBeenCalled();
    expect(result.id).toBe(dummyQrId);
    expect(result.name).toBe("My Promo");
  });

  it("throws when attempting to delete a QR code outside of workspace", async () => {
    const mockFindFirst = vi.mocked(prisma.qrCode.findFirst);
    mockFindFirst.mockResolvedValueOnce(null); // not found in this workspace

    await expect(
      deleteQRCodePrisma(dummyWorkspaceId, dummyQrId)
    ).rejects.toThrow("QR code not found or access denied");
  });

  it("duplicates a QR code and appends (Copy)", async () => {
    const mockFindFirst = vi.mocked(prisma.qrCode.findFirst);
    const mockCreate = vi.mocked(prisma.qrCode.create);

    mockFindFirst.mockResolvedValueOnce({
      id: dummyQrId,
      workspaceId: dummyWorkspaceId,
      folderId: null,
      name: "Conference Pass",
      type: "text",
      mode: "static",
      slug: null,
      destinationUrl: null,
      payload: {
        rawPayload: "CONF-2026",
        detail: "CONF-2026",
        formData: { text: "CONF-2026" },
      },
      design: {
        dotType: "square",
        dotsColor: "#000000",
        backgroundColor: "#ffffff",
        cornersSquareType: "square",
        cornersSquareColor: "#000000",
        cornersDotType: "square",
        cornersDotColor: "#000000",
        customEyeColors: false,
        margin: 10,
        errorCorrectionLevel: "M",
        logoUrl: null,
        logoSize: 0.3,
        logoMargin: 4,
      },
      status: "active",
      expiresAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockCreate.mockResolvedValueOnce({
      id: "33333333-3333-4333-8333-333333333333",
      workspaceId: dummyWorkspaceId,
      folderId: null,
      name: "Conference Pass (Copy)",
      type: "text",
      mode: "static",
      slug: null,
      destinationUrl: null,
      payload: {
        rawPayload: "CONF-2026",
        detail: "CONF-2026",
        formData: { text: "CONF-2026" },
      },
      design: {
        dotType: "square",
        dotsColor: "#000000",
        backgroundColor: "#ffffff",
        cornersSquareType: "square",
        cornersSquareColor: "#000000",
        cornersDotType: "square",
        cornersDotColor: "#000000",
        customEyeColors: false,
        margin: 10,
        errorCorrectionLevel: "M",
        logoUrl: null,
        logoSize: 0.3,
        logoMargin: 4,
      },
      status: "active",
      expiresAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const dup = await duplicateQRCodePrisma(dummyWorkspaceId, dummyQrId);
    expect(dup.name).toBe("Conference Pass (Copy)");
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: "Conference Pass (Copy)",
          workspaceId: dummyWorkspaceId,
        }),
      })
    );
  });

  it("creates and deletes a folder scoped to workspace", async () => {
    const mockFolderCreate = vi.mocked(prisma.folder.create);
    const mockFolderFindFirst = vi.mocked(prisma.folder.findFirst);
    const mockFolderDelete = vi.mocked(prisma.folder.delete);
    const mockQrUpdateMany = vi.mocked(prisma.qrCode.updateMany);

    const dummyFolderId = "44444444-4444-4444-8444-444444444444";

    mockFolderCreate.mockResolvedValueOnce({
      id: dummyFolderId,
      workspaceId: dummyWorkspaceId,
      name: "Marketing",
      color: "#2563EB",
      createdAt: new Date(),
    });

    const folder = await createFolderPrisma({
      workspaceId: dummyWorkspaceId,
      name: "Marketing",
      color: "#2563EB",
    });

    expect(folder.name).toBe("Marketing");
    expect(folder.workspace_id).toBe(dummyWorkspaceId);

    // Test delete folder
    mockFolderFindFirst.mockResolvedValueOnce({
      id: dummyFolderId,
      workspaceId: dummyWorkspaceId,
      name: "Marketing",
      color: "#2563EB",
      createdAt: new Date(),
    });

    const deleted = await deleteFolderPrisma(dummyWorkspaceId, dummyFolderId);
    expect(deleted).toBe(true);
    expect(mockQrUpdateMany).toHaveBeenCalledWith({
      where: { folderId: dummyFolderId, workspaceId: dummyWorkspaceId },
      data: { folderId: null },
    });
    expect(mockFolderDelete).toHaveBeenCalledWith({
      where: { id: dummyFolderId },
    });
  });
});
