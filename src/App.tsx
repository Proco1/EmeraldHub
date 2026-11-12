import React, { useState, useEffect } from 'react';
import { StarBackground } from './components/StarBackground';
import { Navbar, ActiveTab } from './components/Navbar';
import { HomeSection } from './components/HomeSection';
import { ProxiesSection } from './components/ProxiesSection';
import { GamesSection } from './components/GamesSection';
import { SettingsModal } from './components/SettingsModal';
import { Settings as SettingsIcon, Minimize2 } from 'lucide-react';
import {
  AppSettings,
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  applyCustomCloak,
} from './utils/settings';
import { CLOAK_PRESETS, applyCloak } from './utils/cloak';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [isSimulatedFullscreen, setIsSimulatedFullscreen] = useState(false);

  // Sync data-theme attribute on root element whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme || 'emerald');
  }, [settings.theme]);

  // Restore active cloak on initial load
  useEffect(() => {
    if (settings.cloakPresetId && settings.cloakPresetId !== 'default' && settings.cloakPresetId !== 'custom') {
      const preset = CLOAK_PRESETS.find((p) => p.id === settings.cloakPresetId);
      if (preset) applyCloak(preset);
    } else if (settings.cloakPresetId === 'custom' && (settings.customCloakTitle || settings.customCloakIcon)) {
      applyCustomCloak(settings.customCloakTitle, settings.customCloakIcon);
    }
  }, []);

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
    const defaultPreset = CLOAK_PRESETS.find((p) => p.id === 'default');
    if (defaultPreset) applyCloak(defaultPreset);
  };

  // Global keydown listener for Panic Redirect and Fullscreen Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === settings.panicKey) {
        window.location.href = settings.panicUrl;
      }
      if (e.key === 'Escape' && isSimulatedFullscreen) {
        setIsSimulatedFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.panicKey, settings.panicUrl, isSimulatedFullscreen]);

  // Robust fullscreen toggle: attempts native fullscreen, falls back to simulated viewport fullscreen
  const toggleFullscreen = () => {
    const doc = document as any;
    const docEl = document.documentElement as any;

    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().then(() => {
          setIsSimulatedFullscreen(true);
        }).catch(() => {
          setIsSimulatedFullscreen(true);
        });
      } else if (docEl.webkitRequestFullscreen) {
        try {
          docEl.webkitRequestFullscreen();
          setIsSimulatedFullscreen(true);
        } catch {
          setIsSimulatedFullscreen(true);
        }
      } else {
        setIsSimulatedFullscreen(true);
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {});
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
      setIsSimulatedFullscreen(false);
    }
  };

  // Sync state if user exits via browser ESC
  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as any;
      if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
        setIsSimulatedFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const triggerPanic = () => {
    window.location.href = settings.panicUrl;
  };

  const getStarSpeedMultiplier = () => {
    switch (settings.starSpeed) {
      case 'slow':
        return 0.5;
      case 'fast':
        return 2.0;
      case 'normal':
      default:
        return 1.0;
    }
  };

  return (
    <div
      className={`relative text-white flex flex-col transition-colors ${
        isSimulatedFullscreen
          ? 'fixed inset-0 z-50 w-screen h-screen overflow-y-auto'
          : 'min-h-screen'
      }`}
      style={{
        backgroundColor: 'var(--body-bg)',
        color: 'var(--accent-text)',
      }}
    >
      {/* Floating exit fullscreen button when simulated fullscreen is active */}
      {isSimulatedFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="fixed top-3 right-4 z-[999] flex items-center gap-1.5 px-3 py-1.5 rounded-full text-black font-bold text-xs transition-all cursor-pointer"
          style={{
            backgroundColor: 'var(--accent-primary)',
            boxShadow: '0 0 20px var(--accent-glow)',
          }}
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span>Exit Fullscreen</span>
        </button>
      )}

      {/* Dynamic Canvas Background with user's theme & speed (Matrix rain or Starfield) */}
      <StarBackground
        enabled={settings.starBackgroundEnabled}
        speedMultiplier={getStarSpeedMultiplier()}
        themeId={settings.theme}
      />

      {/* Main Container Content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSettingsModal={() => setIsSettingsOpen(true)}
          panicKey={settings.panicKey}
          onTriggerPanic={triggerPanic}
          isSimulatedFullscreen={isSimulatedFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />

        {/* Content Area */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
          {activeTab === 'home' && (
            <HomeSection
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenSettingsModal={() => setIsSettingsOpen(true)}
              panicKey={settings.panicKey}
            />
          )}

          {activeTab === 'proxies' && <ProxiesSection />}

          {activeTab === 'games' && <GamesSection />}
        </main>

        {/* Clean Themed Footer */}
        <footer
          className="mt-auto border-t py-5 backdrop-blur-md transition-colors"
          style={{
            backgroundColor: 'var(--accent-bg-bar)',
            borderColor: 'var(--accent-border)',
            color: 'var(--accent-text)',
          }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  boxShadow: '0 0 8px var(--accent-primary)',
                }}
              />
              <span className="font-mono text-white font-semibold">
                EMERALD PORTAL
              </span>
              <span style={{ color: 'var(--accent-border)' }}>|</span>
              <span className="font-mono text-white/50">v3.3</span>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab('proxies')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Proxies (Frogie, TungTung, CFD)
              </button>
              <button
                onClick={() => setActiveTab('games')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                GN-Math Games
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <SettingsIcon className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                <span>Settings</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-white/60">
              Panic Hotkey: <kbd className="px-1.5 py-0.5 rounded border text-white font-bold" style={{ backgroundColor: 'var(--accent-bg-soft)', borderColor: 'var(--accent-border)' }}>{settings.panicKey}</kbd>
            </div>
          </div>
        </footer>
      </div>

      {/* Unified Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetSettings={handleResetSettings}
      />
    </div>
  );
}
