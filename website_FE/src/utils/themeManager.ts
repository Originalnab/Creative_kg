import { ThemePaletteConfig, ThemePaletteId } from '../types';

export const THEME_PALETTES: Record<ThemePaletteId, ThemePaletteConfig> = {
  amber: {
    id: 'amber',
    name: 'Amber Gold',
    description: 'Warm golden radiance, deep obsidian surfaces, and timeless classic cinema glow.',
    primaryHex: '#f59e0b',
    primaryHoverHex: '#d97706',
    primaryRgb: '245, 158, 11',
    accentHex: '#fbbf24',
    surfaceHex: '#0a0a0a',
    glowRgba: 'rgba(245, 158, 11, 0.25)',
    badge: 'Signature Noir',
    previewColors: ['#f59e0b', '#fbbf24', '#0a0a0a', '#171717'],
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Velvet',
    description: 'Deep forest midnight, vivid emerald, and organic jade accents for haute couture editorial.',
    primaryHex: '#10b981',
    primaryHoverHex: '#059669',
    primaryRgb: '16, 185, 129',
    accentHex: '#34d399',
    surfaceHex: '#05100a',
    glowRgba: 'rgba(16, 185, 129, 0.25)',
    badge: 'Couture Green',
    previewColors: ['#10b981', '#34d399', '#05100a', '#0a1d13'],
  },
  sapphire: {
    id: 'sapphire',
    name: 'Royal Sapphire',
    description: 'Deep oceanic blues and celestial cyan highlights for architectural prestige and clean luxury.',
    primaryHex: '#3b82f6',
    primaryHoverHex: '#2563eb',
    primaryRgb: '59, 130, 246',
    accentHex: '#60a5fa',
    surfaceHex: '#070b14',
    glowRgba: 'rgba(59, 130, 246, 0.25)',
    badge: 'Midnight Azure',
    previewColors: ['#3b82f6', '#60a5fa', '#070b14', '#0d1527'],
  },
  rose: {
    id: 'rose',
    name: 'Rose Champagne',
    description: 'Romantic rose gold, delicate blush, and velvet noir for luxury nuptials and emotional portraits.',
    primaryHex: '#f43f5e',
    primaryHoverHex: '#e11d48',
    primaryRgb: '244, 63, 94',
    accentHex: '#fb7185',
    surfaceHex: '#12060b',
    glowRgba: 'rgba(244, 63, 94, 0.25)',
    badge: 'Blush Elegance',
    previewColors: ['#f43f5e', '#fb7185', '#12060b', '#1f0d14'],
  },
  monochrome: {
    id: 'monochrome',
    name: 'Monochrome Platinum',
    description: 'Titanium whites, brutalist blacks, and silver chrome for fine-art museum galleries.',
    primaryHex: '#e5e5e5',
    primaryHoverHex: '#ffffff',
    primaryRgb: '229, 229, 229',
    accentHex: '#a3a3a3',
    surfaceHex: '#000000',
    glowRgba: 'rgba(255, 255, 255, 0.2)',
    badge: 'Pure Minimalist',
    previewColors: ['#e5e5e5', '#ffffff', '#000000', '#1c1c1c'],
  },
};

export function getThemeConfig(themeId?: ThemePaletteId): ThemePaletteConfig {
  if (!themeId || !THEME_PALETTES[themeId]) {
    return THEME_PALETTES.amber;
  }
  return THEME_PALETTES[themeId];
}

/**
 * Injects CSS custom properties dynamically into document root.
 */
export function applyThemeToDOM(themeId: ThemePaletteId): void {
  const config = getThemeConfig(themeId);
  const root = document.documentElement;

  root.style.setProperty('--theme-primary', config.primaryHex);
  root.style.setProperty('--theme-primary-hover', config.primaryHoverHex);
  root.style.setProperty('--theme-primary-rgb', config.primaryRgb);
  root.style.setProperty('--theme-accent', config.accentHex);
  root.style.setProperty('--theme-surface', config.surfaceHex);
  root.style.setProperty('--theme-glow', config.glowRgba);

  root.setAttribute('data-theme', themeId);
  document.body.setAttribute('data-theme', themeId);
}
