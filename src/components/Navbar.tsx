import React from 'react';
import {
  Globe,
  Gamepad2,
  Home,
  Settings,
  Maximize,
  Minimize,
  Flame,
  ExternalLink,
} from 'lucide-react';

export type ActiveTab = 'home' | 'proxies' | 'games';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSettingsModal: () => void;
  panicKey: string;
  onTriggerPanic: () => void;
  isSimulatedFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettingsModal,
  panicKey,
  onTriggerPanic,
  isSimulatedFullscreen,
  onToggleFullscreen,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'proxies', label: 'Proxies', icon: <Globe className="w-4 h-4" />, badge: '3 Mirrors' },
    { id: 'games', label: 'Games', icon: <Gamepad2 className="w-4 h-4" />, badge: '850+' },
  ];

  return (
    <header
      className="sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors"
      style={{
        backgroundColor: 'rgba(3, 8, 5, 0.85)',
        borderColor: 'var(--accent-border)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 group text-left cursor-pointer transition-transform hover:scale-105"
        >
          <div
            className="relative w-8 h-8 rounded-xl flex items-center justify-center border transition-all"
            style={{
              background: 'linear-gradient(135deg, var(--accent-primary-hover), var(--accent-primary), var(--accent-bg-card))',
              borderColor: 'var(--accent-primary)',
              boxShadow: '0 0 15px var(--accent-glow)',
            }}
          >
            <Flame className="w-4 h-4 text-black group-hover:rotate-12 transition-transform duration-300 fill-black" />
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base tracking-wider text-white font-mono">
              EMERALD<span style={{ color: 'var(--accent-primary)' }}>.</span>HUB
            </span>
          </div>
        </button>

        {/* Center Navigation Tabs */}
        <nav
          className="flex items-center gap-1 border p-1 rounded-2xl shadow-inner transition-colors"
          style={{
            backgroundColor: 'var(--accent-bg-card)',
            borderColor: 'var(--accent-border)',
          }}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive ? 'font-bold' : 'text-white/80 hover:text-white'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: 'var(--accent-primary)',
                        color: '#000000',
                        boxShadow: '0 0 18px var(--accent-glow)',
                      }
                    : {}
                }
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className="hidden sm:inline text-[9px] px-1.5 py-0.5 rounded-md font-mono"
                    style={
                      isActive
                        ? { backgroundColor: 'rgba(0,0,0,0.2)', color: '#000' }
                        : {
                            backgroundColor: 'var(--accent-bg-soft)',
                            color: 'var(--accent-primary)',
                            border: '1px solid var(--accent-border)',
                          }
                    }
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Tools (Settings, Fullscreen, Panic) */}
        <div className="flex items-center gap-2">
          {/* Settings Button */}
          <button
            onClick={onOpenSettingsModal}
            title="Settings (Themes, Cloaks, Panic Keys)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-sm hover:scale-105"
            style={{
              backgroundColor: 'var(--accent-bg-soft)',
              borderColor: 'var(--accent-border)',
              color: 'var(--accent-text)',
            }}
          >
            <Settings className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={onToggleFullscreen}
            title={isSimulatedFullscreen ? 'Exit Fullscreen (Esc)' : 'Enter Fullscreen'}
            className="p-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
            style={
              isSimulatedFullscreen
                ? {
                    backgroundColor: 'var(--accent-primary)',
                    color: '#000',
                    borderColor: 'var(--accent-primary)',
                    boxShadow: '0 0 12px var(--accent-glow)',
                  }
                : {
                    backgroundColor: 'var(--accent-bg-soft)',
                    borderColor: 'var(--accent-border)',
                    color: 'var(--accent-text)',
                  }
            }
          >
            {isSimulatedFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Popout New Window */}
          <button
            onClick={() => window.open(window.location.href, '_blank')}
            title="Open in Unrestricted Fullscreen New Tab"
            className="hidden sm:flex items-center p-1.5 rounded-xl border text-xs transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--accent-bg-soft)',
              borderColor: 'var(--accent-border)',
              color: 'var(--accent-text)',
            }}
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          {/* Quick Panic Button */}
          <button
            onClick={onTriggerPanic}
            title={`Quick Panic Redirect (Hotkey: ${panicKey})`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/50 hover:bg-red-900/70 border border-red-500/40 text-red-300 text-xs font-bold transition-all shadow-[0_0_12px_rgba(239,68,68,0.2)] cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
            <span>Panic</span>
            <span className="text-[10px] font-mono bg-red-900/80 px-1 py-0.2 rounded border border-red-500/30 text-red-200">
              {panicKey}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
