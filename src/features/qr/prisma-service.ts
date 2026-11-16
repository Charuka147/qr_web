import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import {
  SaveQRRecordParams,
  buildQRDatabaseRecord,
  buildDuplicateQRRecord,
  folderInputSchema,
} from "@/features/qr/qr-service";
import { SavedQRCode, ActiveQRType, Folder } from "@/types/qr";

/**
 * Server-side Prisma operations for QR Studio.
 * Every operation rigorously enforces tenant scoping via `workspaceId`
 * to protect data integrity and multi-tenant security when bypassing RLS.
 */

export async function getWorkspaceQRCodes(
  workspaceId: string,
  options?: {
    search?: string;
    type?: ActiveQRType | "all";
    folderId?: string | "all" | "unfiled";
  }
): Promise<SavedQRCode[]> {
  const where: Record<string, unknown> = {
    workspaceId,
  };

  if (options?.type && options.type !== "all") {
    where.type = options.type;
  }

  if (options?.folderId) {
    if (options.folderId === "unfiled") {
      where.folderId = null;
    } else if (options.folderId !== "all") {
      where.folderId = options.folderId;
    }
  }

  if (options?.search && options.search.trim().length > 0) {
    where.name = {
      contains: options.search.trim(),
      mode: "insensitive",
    };
  }

  const rows = await prisma.qrCode.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return rows.map((r) => ({
    id: r.id,
    workspace_id: r.workspaceId,
    folder_id: r.folderId,
    name: r.name,
    type: r.type as ActiveQRType,
    mode: r.mode,
    slug: r.slug,
    destination_url: r.destinationUrl,
    payload: r.payload as unknown as SavedQRCode["payload"],
    design: r.design as unknown as SavedQRCode["design"],
    status: r.status,
    expires_at: r.expiresAt ? r.expiresAt.toISOString() : null,
    created_at: r.createdAt.toISOString(),
    updated_at: r.updatedAt.toISOString(),
  }));
}

export async function getQRCodeById(
  workspaceId: string,
  id: string
): Promise<SavedQRCode | null> {
  const r = await prisma.qrCode.findFirst({
    where: {
      id,
      workspaceId,
    },
  });

  if (!r) return null;

  return {
    id: r.id,
    workspace_id: r.workspaceId,
    folder_id: r.folderId,
    name: r.name,
    type: r.type as ActiveQRType,
    mode: r.mode,
    slug: r.slug,
    destination_url: r.destinationUrl,
    payload: r.payload as unknown as SavedQRCode["payload"],
    design: r.design as unknown as SavedQRCode["design"],
    status: r.status,
    expires_at: r.expiresAt ? r.expiresAt.toISOString() : null,
    created_at: r.createdAt.toISOString(),
    updated_at: r.updatedAt.toISOString(),
  };
}

export async function createQRCodePrisma<K extends ActiveQRType>(
  params: SaveQRRecordParams<K>
): Promise<SavedQRCode> {
  const validated = buildQRDatabaseRecord(params);

  const created = await prisma.qrCode.create({
    data: {
      workspaceId: validated.workspace_id,
      folderId: validated.folder_id,
      name: validated.name,
      type: validated.type,
      mode: validated.mode,
      status: validated.status,
      payload: validated.payload as unknown as Prisma.InputJsonValue,
      design: validated.design as unknown as Prisma.InputJsonValue,
    },
  });

  return {
    id: created.id,
    workspace_id: created.workspaceId,
    folder_id: created.folderId,
    name: created.name,
    type: created.type as ActiveQRType,
    mode: created.mode,
    slug: created.slug,
    destination_url: created.destinationUrl,
    payload: created.payload as unknown as SavedQRCode["payload"],
    design: created.design as unknown as SavedQRCode["design"],
    status: created.status,
    expires_at: created.expiresAt ? created.expiresAt.toISOString() : null,
    created_at: created.createdAt.toISOString(),
    updated_at: created.updatedAt.toISOString(),
  };
}

export async function updateQRCodePrisma<K extends ActiveQRType>(
  workspaceId: string,
  id: string,
  params: SaveQRRecordParams<K>
): Promise<SavedQRCode> {
  // Confirm ownership in workspace
  const existing = await prisma.qrCode.findFirst({
    where: { id, workspaceId },
  });

  if (!existing) {
    throw new Error("QR code not found or access denied");
  }

  const validated = buildQRDatabaseRecord(params);

  const updated = await prisma.qrCode.update({
    where: { id },
    data: {
      folderId: validated.folder_id,
      name: validated.name,
      payload: validated.payload as unknown as Prisma.InputJsonValue,
      design: validated.design as unknown as Prisma.InputJsonValue,
      updatedAt: new Date(),
    },
  });

  return {
    id: updated.id,
    workspace_id: updated.workspaceId,
    folder_id: updated.folderId,
    name: updated.name,
    type: updated.type as ActiveQRType,
    mode: updated.mode,
    slug: updated.slug,
    destination_url: updated.destinationUrl,
    payload: updated.payload as unknown as SavedQRCode["payload"],
    design: updated.design as unknown as SavedQRCode["design"],
    status: updated.status,
    expires_at: updated.expiresAt ? updated.expiresAt.toISOString() : null,
    created_at: updated.createdAt.toISOString(),
    updated_at: updated.updatedAt.toISOString(),
  };
}

export async function deleteQRCodePrisma(
  workspaceId: string,
  id: string
): Promise<boolean> {
  const existing = await prisma.qrCode.findFirst({
    where: { id, workspaceId },
  });

  if (!existing) {
    throw new Error("QR code not found or access denied");
  }

  await prisma.qrCode.delete({
    where: { id },
  });

  return true;
}

export async function duplicateQRCodePrisma(
  workspaceId: string,
  id: string
): Promise<SavedQRCode> {
  const existing = await getQRCodeById(workspaceId, id);
  if (!existing) {
    throw new Error("QR code not found or access denied");
  }

  const dupRecord = buildDuplicateQRRecord(existing);

  const created = await prisma.qrCode.create({
    data: {
      workspaceId: dupRecord.workspace_id,
      folderId: dupRecord.folder_id,
      name: dupRecord.name,
      type: dupRecord.type,
      mode: dupRecord.mode,
      status: dupRecord.status,
      payload: dupRecord.payload as unknown as Prisma.InputJsonValue,
      design: dupRecord.design as unknown as Prisma.InputJsonValue,
    },
  });

  return {
    id: created.id,
    workspace_id: created.workspaceId,
    folder_id: created.folderId,
    name: created.name,
    type: created.type as ActiveQRType,
    mode: created.mode,
    slug: created.slug,
    destination_url: created.destinationUrl,
    payload: created.payload as unknown as SavedQRCode["payload"],
    design: created.design as unknown as SavedQRCode["design"],
    status: created.status,
    expires_at: created.expiresAt ? created.expiresAt.toISOString() : null,
    created_at: created.createdAt.toISOString(),
    updated_at: created.updatedAt.toISOString(),
  };
}

export async function getWorkspaceFolders(
  workspaceId: string
): Promise<Folder[]> {
  const rows = await prisma.folder.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "asc" },
  });

  return rows.map((f) => ({
    id: f.id,
    workspace_id: f.workspaceId,
    name: f.name,
    color: f.color || "#2563EB",
    created_at: f.createdAt.toISOString(),
  }));
}

export async function createFolderPrisma(params: {
  workspaceId: string;
  name: string;
  color?: string;
}): Promise<Folder> {
  const validated = folderInputSchema.parse(params);

  const created = await prisma.folder.create({
    data: {
      workspaceId: validated.workspaceId,
      name: validated.name,
      color: validated.color,
    },
  });

  return {
    id: created.id,
    workspace_id: created.workspaceId,
    name: created.name,
    color: created.color || "#2563EB",
    created_at: created.createdAt.toISOString(),
  };
}

export async function deleteFolderPrisma(
  workspaceId: string,
  folderId: string
): Promise<boolean> {
  const existing = await prisma.folder.findFirst({
    where: { id: folderId, workspaceId },
  });

  if (!existing) {
    throw new Error("Folder not found or access denied");
  }

  // Set null on qr codes filed in this folder first, then delete folder
  await prisma.qrCode.updateMany({
    where: { folderId, workspaceId },
    data: { folderId: null },
  });

  await prisma.folder.delete({
    where: { id: folderId },
  });

  return true;
}
