import type { CSSProperties } from "react";
import type { HomePageTheme } from "./types";

export type HomeSectionStyle = {
  backgroundColor?: string;
  backgroundClass?: string;
  paddingY?: "default" | "compact" | "spacious" | "none";
  borderRadius?: string;
  hideOnMobile?: boolean;
};

export function getSectionStyle(content: Record<string, unknown>): HomeSectionStyle {
  return (content.style ?? {}) as HomeSectionStyle;
}

export function spacingClassForTheme(theme: HomePageTheme) {
  if (theme.sectionSpacing === "compact") return "py-12 sm:py-16";
  if (theme.sectionSpacing === "spacious") return "py-24 sm:py-32";
  return "py-20 sm:py-28";
}

export function resolveSectionPadding(
  theme: HomePageTheme,
  style: HomeSectionStyle,
): string {
  if (style.paddingY === "none") return "py-0";
  if (style.paddingY === "compact") return "py-12 sm:py-16";
  if (style.paddingY === "spacious") return "py-24 sm:py-32";
  return spacingClassForTheme(theme);
}

export function resolveSectionSurface(
  theme: HomePageTheme,
  style: HomeSectionStyle,
  defaultPad: string,
): { className: string; style: CSSProperties } {
  const pad = resolveSectionPadding(theme, style);
  const className = [defaultPad === pad ? pad : pad, style.backgroundClass]
    .filter(Boolean)
    .join(" ");

  const inlineStyle: CSSProperties = {};
  if (style.backgroundColor?.trim()) {
    inlineStyle.background = style.backgroundColor;
  }
  if (style.borderRadius?.trim()) {
    inlineStyle.borderRadius = style.borderRadius;
  }

  return { className, style: inlineStyle };
}

export const SECTION_PADDING_OPTIONS = [
  { value: "default", label: "افتراضي (من التصميم)" },
  { value: "compact", label: "مضغوط" },
  { value: "spacious", label: "واسع" },
  { value: "none", label: "بدون" },
] as const;

export const TRANSFORMATION_ACCENTS = [
  { value: "rose", label: "Rose" },
  { value: "gold", label: "Gold" },
  { value: "sage", label: "Sage" },
] as const;
