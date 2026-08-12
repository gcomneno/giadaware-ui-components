export type ThemePresetId =
  | 'warm'
  | 'neutral'
  | 'dark'
  | 'noir'
  | 'intimate'
  | 'space'
  | 'funny-coloured';

export type ThemePalette = {
  baseColor: string;
  accentColor: string;
  textColor: string;
  headingColor: string;
  cardColor: string;
};

export type ThemeTokens = ThemePalette & {
  colorScheme: 'light' | 'dark';
  mutedTextColor: string;
  surfaceColor: string;
  borderColor: string;
};

export const THEME_PRESETS: Record<ThemePresetId, ThemePalette> = {
  warm: {
    baseColor: '#f8f0e4',
    accentColor: '#d6be9a',
    textColor: '#2f281f',
    headingColor: '#2f281f',
    cardColor: '#fefdfc'
  },
  neutral: {
    baseColor: '#f4f2ee',
    accentColor: '#c8c2b8',
    textColor: '#1f1f1f',
    headingColor: '#1f1f1f',
    cardColor: '#fefdfd'
  },
  dark: {
    baseColor: '#13110f',
    accentColor: '#e4c4a0',
    textColor: '#f8f4ec',
    headingColor: '#f8f4ec',
    cardColor: '#42413f'
  },
  noir: {
    baseColor: '#0f0e0d',
    accentColor: '#8c3a44',
    textColor: '#e8e0d4',
    headingColor: '#f5efe6',
    cardColor: '#1c1a18'
  },
  intimate: {
    baseColor: '#f4eee8',
    accentColor: '#8d4f5b',
    textColor: '#3f3234',
    headingColor: '#2f2428',
    cardColor: '#fffaf7'
  },
  space: {
    baseColor: '#090b1a',
    accentColor: '#6f8cff',
    textColor: '#e8ecff',
    headingColor: '#ffffff',
    cardColor: '#151a33'
  },
  'funny-coloured': {
    baseColor: '#fff7e8',
    accentColor: '#087f7b',
    textColor: '#2d2a32',
    headingColor: '#31265a',
    cardColor: '#ffffff'
  }
};

export function resolveThemeTokens(palette: ThemePalette): ThemeTokens {
  const darkBase = relativeLuminance(palette.baseColor) < 0.2;
  return {
    ...palette,
    colorScheme: darkBase ? 'dark' : 'light',
    mutedTextColor: mixHex(
      palette.textColor,
      palette.baseColor,
      darkBase ? 0.28 : 0.42
    ),
    surfaceColor: darkBase
      ? mixWithWhite(palette.baseColor, 0.12)
      : mixWithWhite(palette.baseColor, 0.72),
    borderColor: darkBase
      ? mixWithWhite(palette.baseColor, 0.34)
      : mixWithWhite(palette.baseColor, 0.55)
  };
}

export function themeCssVariables(tokens: ThemeTokens): Record<string, string> {
  return {
    '--giu-theme-base': tokens.baseColor,
    '--giu-theme-accent': tokens.accentColor,
    '--giu-theme-text': tokens.textColor,
    '--giu-theme-heading': tokens.headingColor,
    '--giu-theme-card': tokens.cardColor,
    '--giu-theme-muted': tokens.mutedTextColor,
    '--giu-theme-surface': tokens.surfaceColor,
    '--giu-theme-border': tokens.borderColor,
    '--giu-theme-color-scheme': tokens.colorScheme
  };
}

function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 1;
  const channel = (value: number) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

function mixHex(hexA: string, hexB: string, ratioOfB: number): string {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  if (!a || !b) return hexA;
  const mix = (x: number, y: number) => Math.round(x + (y - x) * ratioOfB);
  return rgbToHex(mix(a.r, b.r), mix(a.g, b.g), mix(a.b, b.b));
}

function mixWithWhite(hex: string, ratio: number): string {
  return mixHex(hex, '#ffffff', ratio);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = /^#([0-9a-fA-F]{6})$/.exec(hex);
  if (!match) return null;
  const value = Number.parseInt(match[1], 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}
