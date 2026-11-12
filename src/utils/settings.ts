import { CloakPreset, CLOAK_PRESETS, applyCloak } from './cloak';

export interface ThemeOption {
  id: string;
  name: string;
  colorName: string;
  primaryHex: string;
  accentBg: string;
  borderHex: string;
  description: string;
}

export const THEMES: ThemeOption[] = [
  {
    id: 'emerald',
    name: 'Emerald Neon',
    colorName: 'Green',
    primaryHex: '#10b981',
    accentBg: '#05140b',
    borderHex: 'rgba(16, 185, 129, 0.35)',
    description: 'Cyber emerald & obsidian black with glowing starlight',
  },
  {
    id: 'matrix',
    name: 'Matrix Code',
    colorName: 'Lime',
    primaryHex: '#22c55e',
    accentBg: '#031405',
    borderHex: 'rgba(34, 197, 94, 0.4)',
    description: 'Electric hacker terminal lime & deep void carbon',
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    colorName: 'Cyan',
    primaryHex: '#06b6d4',
    accentBg: '#041117',
    borderHex: 'rgba(6, 182, 212, 0.35)',
    description: 'Abyssal bioluminescent teal and cyber marine',
  },
  {
    id: 'amethyst',
    name: 'Cyber Amethyst',
    colorName: 'Purple',
    primaryHex: '#a855f7',
    accentBg: '#12051c',
    borderHex: 'rgba(168, 85, 247, 0.35)',
    description: 'Synthwave violet & dark velvet void space',
  },
  {
    id: 'crimson',
    name: 'Crimson Rogue',
    colorName: 'Ruby',
    primaryHex: '#ef4444',
    accentBg: '#180505',
    borderHex: 'rgba(239, 68, 68, 0.35)',
    description: 'Stealth alarm red and aggressive dark carbon',
  },
  {
    id: 'midnight',
    name: 'Midnight Slate',
    colorName: 'Monochrome',
    primaryHex: '#94a3b8',
    accentBg: '#0f172a',
    borderHex: 'rgba(148, 163, 184, 0.3)',
    description: 'Stealth monochromatic dark titanium and gray',
  },
];

export interface AppSettings {
  theme: string;
  panicKey: string;
  panicUrl: string;
  starBackgroundEnabled: boolean;
  starSpeed: 'slow' | 'normal' | 'fast';
  cloakPresetId: string;
  customCloakTitle: string;
  customCloakIcon: string;
}

const SETTINGS_KEY = 'emerald_portal_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'emerald',
  panicKey: 'Escape',
  panicUrl: 'https://www.google.com',
  starBackgroundEnabled: true,
  starSpeed: 'normal',
  cloakPresetId: 'default',
  customCloakTitle: '',
  customCloakIcon: '',
};

export const loadSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: AppSettings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
};

export const applyCustomCloak = (title: string, iconUrl: string) => {
  if (title) document.title = title;

  if (iconUrl) {
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = iconUrl;
  }
};
