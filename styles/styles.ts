import { CSSProperties } from "react";
import { COLORS } from "./colors";

export const buttonStyles = {
  backgroundColor: COLORS.accentPrimary,
  "--btn-hover": COLORS.accentHover,
  "--btn-ring": COLORS.accentRing,
} as CSSProperties;

export const inputStyles = {
  backgroundColor: COLORS.inputBackground,
  borderColor: COLORS.borderSubtle,
  "--input-ring": COLORS.accentRing,
  "--input-border-focus": COLORS.accentPrimary,
} as CSSProperties;

export const alertErrorStyles: CSSProperties = {
  borderColor: COLORS.errorBorder,
  backgroundColor: COLORS.errorBackground,
  color: COLORS.errorText,
};

export const alertSuccessStyles: CSSProperties = {
  borderColor: COLORS.successBorder,
  backgroundColor: COLORS.successBackground,
  color: COLORS.successText,
};

export const primaryButtonStyles: CSSProperties & Record<string, string> = {
  backgroundColor: COLORS.accentPrimary,
  "--btn-hover": COLORS.accentHover,
  "--btn-ring": COLORS.accentRing,
};

export const secondaryButtonStyles: CSSProperties & Record<string, string> = {
  backgroundColor: COLORS.inputBackground,
  borderColor: COLORS.borderSubtle,
  "--btn-hover": COLORS.accentPrimary,
  "--btn-ring": COLORS.accentRing,
};

export const actionButtonClasses =
  "inline-flex items-center justify-center rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition hover:bg-(--btn-hover) focus:outline-none focus:ring-4 focus:ring-(--btn-ring)";
