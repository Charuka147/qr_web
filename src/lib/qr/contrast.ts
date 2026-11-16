export interface ContrastAnalysis {
  ratio: number;
  isReadable: boolean;
  isOptimal: boolean;
  message?: string;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return [r, g, b];
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return [r, g, b];
  }
  return null;
}

function getLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculates WCAG contrast ratio between foreground and background colors
 */
export function calculateContrastRatio(fgHex: string, bgHex: string): ContrastAnalysis {
  // If background is transparent, assume scanning against white surface
  const actualBg = bgHex === "transparent" ? "#ffffff" : bgHex;

  const fgRgb = hexToRgb(fgHex);
  const bgRgb = hexToRgb(actualBg);

  if (!fgRgb || !bgRgb) {
    return { ratio: 21, isReadable: true, isOptimal: true };
  }

  const l1 = getLuminance(fgRgb);
  const l2 = getLuminance(bgRgb);

  const brighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (brighter + 0.05) / (darker + 0.05);
  const rounded = Math.round(ratio * 10) / 10;

  if (ratio < 2.5) {
    return {
      ratio: rounded,
      isReadable: false,
      isOptimal: false,
      message: "Very low contrast. Smartphone cameras may fail to read this QR code. Darken dots or lighten background.",
    };
  }

  if (ratio < 4.0) {
    return {
      ratio: rounded,
      isReadable: true,
      isOptimal: false,
      message: "Moderate contrast. Recommended for bright screens, but may be hard to scan in low-light environments.",
    };
  }

  return {
    ratio: rounded,
    isReadable: true,
    isOptimal: true,
  };
}
