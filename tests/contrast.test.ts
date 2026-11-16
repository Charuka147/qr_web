import { describe, it, expect } from "vitest";
import { calculateContrastRatio } from "@/lib/qr/contrast";

describe("Contrast Ratio Utility", () => {
  it("should calculate high contrast for black on white", () => {
    const result = calculateContrastRatio("#000000", "#ffffff");
    expect(result.ratio).toBe(21);
    expect(result.isReadable).toBe(true);
    expect(result.isOptimal).toBe(true);
  });

  it("should warn on low contrast (e.g., yellow on white)", () => {
    const result = calculateContrastRatio("#FFFF00", "#FFFFFF");
    expect(result.ratio).toBeLessThan(2.5);
    expect(result.isReadable).toBe(false);
    expect(result.message).toBeDefined();
  });

  it("should handle dark mode background properly", () => {
    const result = calculateContrastRatio("#FFFFFF", "#0F172A");
    expect(result.ratio).toBeGreaterThan(10);
    expect(result.isOptimal).toBe(true);
  });
});
