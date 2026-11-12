import React, { useState } from 'react';
import {
  Settings,
  Palette,
  Shield,
  AlertTriangle,
  X,
  Check,
  ExternalLink,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { CLOAK_PRESETS, CloakPreset, applyCloak } from '../utils/cloak';
import { THEMES, AppSettings, applyCustomCloak } from '../utils/settings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetSettings: () => void;
}

type SettingsTab = 'themes' | 'cloak' | 'panic';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('themes');
  const [customTitle, setCustomTitle] = useState(settings.customCloakTitle || '');
  const [customIcon, setCustomIcon] = useState(settings.customCloakIcon || '');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: CloakPreset) => {
    onUpdateSettings({ cloakPresetId: preset.id });
    applyCloak(preset);
  };

  const handleApplyCustomCloak = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      customCloakTitle: customTitle,
      customCloakIcon: customIcon,
      cloakPresetId: 'custom',
    });
    applyCustomCloak(customTitle, customIcon);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div
        className="relative w-full max-w-2xl border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all"
        style={{
          backgroundColor: 'var(--accent-bg-card)',
          borderColor: 'var(--accent-border)',
          boxShadow: '0 0 30px var(--accent-glow)',
        }}
      >
        {/* Top Accent Line */}
        <div
          className="h-1 w-full"
          style={{
            background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-primary-hover), var(--accent-primary))',
          }}
        />

        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{
            backgroundColor: 'var(--accent-bg-bar)',
            borderColor: 'var(--accent-border)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl border flex items-center justify-center"
              style={{
                backgroundColor: 'var(--accent-bg-soft)',
                borderColor: 'var(--accent-border)',
                color: 'var(--accent-primary)',
              }}
            >
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">Portal Settings</h3>
              <p className="text-xs" style={{ color: 'var(--accent-text)' }}>
                Themes, tab cloaks, panic shortcuts & star effects
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          className="flex items-center gap-2 px-6 pt-3 pb-2 border-b"
          style={{
            backgroundColor: 'var(--body-bg)',
            borderColor: 'var(--accent-border)',
          }}
        >
          <button
            onClick={() => setActiveTab('themes')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'themes' ? 'font-bold' : 'text-white/70 hover:text-white'
            }`}
            style={
              activeTab === 'themes'
                ? {
                    backgroundColor: 'var(--accent-primary)',
                    color: '#000',
                    boxShadow: '0 0 12px var(--accent-glow)',
                  }
                : {}
            }
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Themes & Stars</span>
          </button>

          <button
            onClick={() => setActiveTab('cloak')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'cloak' ? 'font-bold' : 'text-white/70 hover:text-white'
            }`}
            style={
              activeTab === 'cloak'
                ? {
                    backgroundColor: 'var(--accent-primary)',
                    color: '#000',
                    boxShadow: '0 0 12px var(--accent-glow)',
                  }
                : {}
            }
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Tab Cloaking</span>
          </button>

          <button
            onClick={() => setActiveTab('panic')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'panic' ? 'font-bold' : 'text-white/70 hover:text-white'
            }`}
            style={
              activeTab === 'panic'
                ? {
                    backgroundColor: 'var(--accent-primary)',
                    color: '#000',
                    boxShadow: '0 0 12px var(--accent-glow)',
                  }
                : {}
            }
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Panic Hotkey</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: THEMES & STARS */}
          {activeTab === 'themes' && (
            <div className="space-y-6">
              {/* Color Themes */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-3" style={{ color: 'var(--accent-primary)' }}>
                  Color Palette Themes (Full-App Theme)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {THEMES.map((th) => {
                    const isSelected = settings.theme === th.id;
                    return (
                      <div
                        key={th.id}
                        onClick={() => onUpdateSettings({ theme: th.id })}
                        className="p-3.5 rounded-xl border text-left cursor-pointer transition-all"
                        style={{
                          backgroundColor: isSelected ? 'var(--accent-bg-card-hover)' : '#000000',
                          borderColor: isSelected ? th.primaryHex : 'var(--accent-border)',
                          boxShadow: isSelected ? `0 0 18px ${th.borderHex}` : 'none',
                        }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-4 h-4 rounded-full border border-white/20"
                              style={{ backgroundColor: th.primaryHex }}
                            />
                            <span className="text-xs font-bold text-white">{th.name}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4" style={{ color: th.primaryHex }} />}
                        </div>
                        <p className="text-[11px] text-white/60 leading-relaxed">
                          {th.description}
                        </p>
                        {th.id === 'matrix' && (
                          <div className="mt-2 text-[10px] font-mono text-green-400 flex items-center gap-1">
                            <span>⚡ Features falling Matrix digital rain</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Star Background Controls */}
              <div
                className="pt-4 border-t space-y-4"
                style={{ borderColor: 'var(--accent-border)' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block" style={{ color: 'var(--accent-primary)' }}>
                      Background Effects (Starfield / Matrix Rain)
                    </label>
                    <p className="text-xs text-white/60 mt-0.5">
                      Enable or disable background canvas animation
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      onUpdateSettings({ starBackgroundEnabled: !settings.starBackgroundEnabled })
                    }
                    className="relative w-12 h-6 rounded-full transition-colors cursor-pointer border"
                    style={{
                      backgroundColor: settings.starBackgroundEnabled ? 'var(--accent-primary)' : 'rgba(0,0,0,0.5)',
                      borderColor: 'var(--accent-border)',
                    }}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full transition-transform ${
                        settings.starBackgroundEnabled ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white'
                      }`}
                    />
                  </button>
                </div>

                {settings.starBackgroundEnabled && (
                  <div
                    className="border rounded-xl p-3"
                    style={{
                      backgroundColor: '#000000',
                      borderColor: 'var(--accent-border)',
                    }}
                  >
                    <label className="block text-[11px] font-semibold mb-2" style={{ color: 'var(--accent-text)' }}>
                      Animation Speed
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['slow', 'normal', 'fast'] as const).map((spd) => (
                        <button
                          key={spd}
                          onClick={() => onUpdateSettings({ starSpeed: spd })}
                          className={`py-1.5 px-3 rounded-lg text-xs capitalize font-medium transition-all cursor-pointer ${
                            settings.starSpeed === spd ? 'font-bold' : 'text-white/70 hover:text-white'
                          }`}
                          style={
                            settings.starSpeed === spd
                              ? {
                                  backgroundColor: 'var(--accent-primary)',
                                  color: '#000',
                                }
                              : {
                                  backgroundColor: 'var(--accent-bg-soft)',
                                  border: '1px solid var(--accent-border)',
                                }
                          }
                        >
                          {spd}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TAB CLOAKING */}
          {activeTab === 'cloak' && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: 'var(--accent-primary)' }}>
                  1-Click Disguise Presets
                </label>
                <p className="text-xs text-white/60 mb-3">
                  Instantly changes the browser tab title and favicon to appear as educational websites.
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {CLOAK_PRESETS.map((preset) => {
                    const isSelected = settings.cloakPresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset)}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer"
                        style={{
                          backgroundColor: isSelected ? 'var(--accent-bg-card-hover)' : '#000000',
                          borderColor: isSelected ? 'var(--accent-primary)' : 'var(--accent-border)',
                          boxShadow: isSelected ? '0 0 15px var(--accent-glow)' : 'none',
                        }}
                      >
                        <img
                          src={preset.icon}
                          alt={preset.name}
                          className="w-5 h-5 object-contain rounded"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <span className="text-xs font-medium truncate flex-1 text-white">{preset.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Cloak Inputs */}
              <div
                className="pt-4 border-t space-y-3"
                style={{ borderColor: 'var(--accent-border)' }}
              >
                <label className="text-xs font-bold uppercase tracking-wider block" style={{ color: 'var(--accent-primary)' }}>
                  Custom Title & Icon
                </label>
                <form onSubmit={handleApplyCustomCloak} className="space-y-3">
                  <div>
                    <label className="block text-[11px] mb-1 text-white/70">Custom Tab Title</label>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder="e.g. My School Portal"
                      className="w-full bg-[#000000] border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      style={{ borderColor: 'var(--accent-border)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] mb-1 text-white/70">Custom Favicon URL</label>
                    <input
                      type="text"
                      value={customIcon}
                      onChange={(e) => setCustomIcon(e.target.value)}
                      placeholder="https://example.com/favicon.ico"
                      className="w-full bg-[#000000] border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      style={{ borderColor: 'var(--accent-border)' }}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl text-black font-semibold text-xs transition-colors cursor-pointer"
                      style={{
                        backgroundColor: 'var(--accent-primary)',
                        boxShadow: '0 0 10px var(--accent-glow)',
                      }}
                    >
                      Apply Custom Cloak
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: PANIC BUTTON */}
          {activeTab === 'panic' && (
            <div className="space-y-5">
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200/90 text-xs leading-relaxed flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Pressing the <strong>Panic Key</strong> at any moment immediately redirects this window to your selected safe academic URL.
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold mb-1.5 text-white/80">
                    Panic Trigger Key
                  </label>
                  <select
                    value={settings.panicKey}
                    onChange={(e) => onUpdateSettings({ panicKey: e.target.value })}
                    className="w-full bg-[#000000] border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    style={{ borderColor: 'var(--accent-border)' }}
                  >
                    <option value="Escape">Escape (ESC)</option>
                    <option value="`">Backtick (`)</option>
                    <option value="]">Bracket (])</option>
                    <option value="F4">F4</option>
                    <option value="Insert">Insert</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1.5 text-white/80">
                    Panic Target Redirect URL
                  </label>
                  <input
                    type="text"
                    value={settings.panicUrl}
                    onChange={(e) => onUpdateSettings({ panicUrl: e.target.value })}
                    placeholder="https://www.google.com"
                    className="w-full bg-[#000000] border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    style={{ borderColor: 'var(--accent-border)' }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono text-white/60">
                  Current key: <kbd className="font-bold text-white px-1.5 py-0.5 rounded border" style={{ borderColor: 'var(--accent-border)' }}>{settings.panicKey}</kbd>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = settings.panicUrl;
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-950/40 border border-amber-500/30 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Test Panic Jump</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className="px-6 py-3.5 border-t flex items-center justify-between"
          style={{
            backgroundColor: 'var(--accent-bg-bar)',
            borderColor: 'var(--accent-border)',
          }}
        >
          <button
            onClick={onResetSettings}
            className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-black font-bold text-xs tracking-wide transition-all cursor-pointer"
            style={{
              backgroundColor: 'var(--accent-primary)',
              boxShadow: '0 0 15px var(--accent-glow)',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
