import { describe, expect, it } from 'vitest';
import { THEME_PRESETS, resolveThemeTokens, themeCssVariables } from './theme.js';

describe('shared theme tokens', () => {
  it('derives a light semantic palette from neutral', () => {
    const tokens = resolveThemeTokens(THEME_PRESETS.neutral);
    expect(tokens.colorScheme).toBe('light');
    expect(tokens.textColor).toBe('#1f1f1f');
    expect(tokens.cardColor).toBe('#fefdfd');
    expect(tokens.mutedTextColor).not.toBe(tokens.textColor);
  });

  it('derives a dark semantic palette with readable text preserved', () => {
    const tokens = resolveThemeTokens(THEME_PRESETS.dark);
    expect(tokens.colorScheme).toBe('dark');
    expect(tokens.textColor).toBe('#f8f4ec');
    expect(tokens.cardColor).toBe('#42413f');
  });

  it('exports stable GIADA UI CSS variable names', () => {
    const variables = themeCssVariables(resolveThemeTokens(THEME_PRESETS.space));
    expect(variables['--giu-theme-text']).toBe('#e8ecff');
    expect(variables['--giu-theme-card']).toBe('#151a33');
    expect(variables['--giu-theme-color-scheme']).toBe('dark');
  });
});
