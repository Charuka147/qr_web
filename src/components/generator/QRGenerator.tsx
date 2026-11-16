"use client";

import React, { useState, useMemo } from "react";
import {
  ActiveQRType,
  QRDesignConfig,
  SavedQRCode,
} from "@/types/qr";
import {
  DEFAULT_DESIGN,
  INITIAL_FORM_DATA,
} from "@/lib/qr/constants";
import {
  encodeURLPayload,
  encodeTextPayload,
  encodeWifiPayload,
  encodeEmailPayload,
  encodePhonePayload,
  encodeSMSPayload,
} from "@/lib/qr/payloads";
import { validateQRData } from "@/lib/qr/validation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { buildQRDatabaseRecord } from "@/features/qr/qr-service";
import { TypeSelector } from "./TypeSelector";
import { ContentForm } from "./ContentForm";
import { DesignControls } from "./DesignControls";
import { QRPreview } from "./QRPreview";

interface QRGeneratorProps {
  initialType?: ActiveQRType;
  existingQR?: SavedQRCode;
  onSaved?: (savedRecord: SavedQRCode) => void;
}

export function QRGenerator({
  initialType = "url",
  existingQR,
  onSaved,
}: QRGeneratorProps) {
  const { user, activeWorkspace, folders } = useAuth();

  const startType = existingQR ? existingQR.type : initialType;
  const [activeType, setActiveType] = useState<ActiveQRType>(startType);
  const [prevInitialType, setPrevInitialType] = useState<ActiveQRType>(startType);

  const [formData, setFormData] = useState(() => {
    const base = { ...INITIAL_FORM_DATA };
    if (existingQR && existingQR.payload?.formData) {
      return {
        ...base,
        [existingQR.type]: {
          ...base[existingQR.type],
          ...existingQR.payload.formData,
        },
      };
    }
    return base;
  });

  const [design, setDesign] = useState<QRDesignConfig>(() => {
    if (existingQR && existingQR.design) {
      return { ...DEFAULT_DESIGN, ...existingQR.design };
    }
    return { ...DEFAULT_DESIGN };
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Sync when initialType changes via route navigation (when not editing a fixed QR)
  if (!existingQR && initialType !== prevInitialType) {
    setPrevInitialType(initialType);
    setActiveType(initialType);
  }

  // Compute live payload and validation
  const { payload, detail, validation } = useMemo(() => {
    let p = "";
    let d = "";

    switch (activeType) {
      case "url":
        p = encodeURLPayload(formData.url);
        d = formData.url.url;
        break;
      case "text":
        p = encodeTextPayload(formData.text);
        d = formData.text.text;
        break;
      case "wifi":
        p = encodeWifiPayload(formData.wifi);
        d = formData.wifi.ssid;
        break;
      case "email":
        p = encodeEmailPayload(formData.email);
        d = formData.email.email;
        break;
      case "phone":
        p = encodePhonePayload(formData.phone);
        d = formData.phone.phone;
        break;
      case "sms":
        p = encodeSMSPayload(formData.sms);
        d = formData.sms.phone;
        break;
    }

    const val = validateQRData(activeType, formData[activeType]);

    return {
      payload: p,
      detail: d,
      validation: val,
    };
  }, [activeType, formData]);

  const handleFormChange = <K extends ActiveQRType>(
    type: K,
    updater: (prev: (typeof formData)[K]) => (typeof formData)[K]
  ) => {
    setSaveStatus(null);
    setFormData((prev) => ({
      ...prev,
      [type]: updater(prev[type]),
    }));
  };

  const handleResetDesign = () => {
    setSaveStatus(null);
    setDesign({ ...DEFAULT_DESIGN });
  };

  const handleSaveToWorkspace = async (name: string, folderId: string | null) => {
    if (!user || !activeWorkspace) {
      setSaveStatus({
        type: "error",
        message: "Please sign in and ensure your workspace is active.",
      });
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);

    try {
      const record = buildQRDatabaseRecord({
        workspaceId: activeWorkspace.id,
        folderId,
        name,
        type: activeType,
        rawPayload: payload,
        detail,
        formData: formData[activeType],
        design,
      });

      const supabase = createClient();

      if (existingQR) {
        const { data: updated, error } = await supabase
          .from("qr_codes")
          .update({
            ...record,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingQR.id)
          .eq("workspace_id", activeWorkspace.id)
          .select("*")
          .single();

        if (error) {
          throw new Error(error.message);
        }

        setSaveStatus({
          type: "success",
          message: "QR code configuration updated!",
        });
        if (onSaved && updated) {
          onSaved(updated as SavedQRCode);
        }
      } else {
        const { data: inserted, error } = await supabase
          .from("qr_codes")
          .insert(record)
          .select("*")
          .single();

        if (error) {
          throw new Error(error.message);
        }

        setSaveStatus({
          type: "success",
          message: "Saved to your workspace dashboard!",
        });
        if (onSaved && inserted) {
          onSaved(inserted as SavedQRCode);
        }
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to save QR code.";
      setSaveStatus({
        type: "error",
        message: msg,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form & Design Controls (7 cols on lg) */}
      <div className="lg:col-span-7 space-y-6">
        <TypeSelector
          activeType={activeType}
          onChange={(type) => {
            setSaveStatus(null);
            setActiveType(type);
          }}
        />

        <ContentForm
          type={activeType}
          formData={formData}
          errors={validation.errors}
          onChange={handleFormChange}
        />

        <DesignControls
          design={design}
          onChange={(updater) => {
            setSaveStatus(null);
            setDesign(updater);
          }}
          onReset={handleResetDesign}
        />
      </div>

      {/* Right Column: Sticky Live Preview, Save & Download (5 cols on lg) */}
      <div className="lg:col-span-5">
        <QRPreview
          type={activeType}
          payload={payload}
          detail={detail}
          design={design}
          isValid={validation.isValid}
          isAuthenticated={Boolean(user && activeWorkspace)}
          folders={folders}
          initialName={existingQR?.name || ""}
          initialFolderId={existingQR?.folder_id || null}
          isEditingExisting={Boolean(existingQR)}
          isSaving={isSaving}
          saveStatus={saveStatus}
          onSave={handleSaveToWorkspace}
        />
      </div>
    </div>
  );
}
