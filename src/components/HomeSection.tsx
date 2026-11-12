import React from 'react';
import { Globe, Gamepad2, ArrowRight } from 'lucide-react';
import { ActiveTab } from './Navbar';

interface HomeSectionProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenSettingsModal: () => void;
  panicKey: string;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] px-4">
      {/* Ambient center glow */}
      <div
        className="absolute w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-40 transition-all"
        style={{ backgroundColor: 'var(--accent-glow)' }}
      />

      {/* Brand Title */}
      <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight mb-10 select-none text-center">
        EMERALD<span style={{ color: 'var(--accent-primary)' }}>.</span>
      </h1>

      {/* Two Clean Hyperlink Portals: Proxies & Games */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
        {/* Proxies Hyperlink */}
        <button
          onClick={() => onNavigate('proxies')}
          className="group relative flex items-center justify-between p-6 rounded-2xl border transition-all duration-200 cursor-pointer text-left"
          style={{
            backgroundColor: 'var(--accent-bg-card)',
            borderColor: 'var(--accent-border)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
            e.currentTarget.style.boxShadow = '0 0 25px var(--accent-glow)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-border)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl border flex items-center justify-center transition-all group-hover:scale-105"
              style={{
                backgroundColor: 'var(--accent-bg-soft)',
                borderColor: 'var(--accent-border)',
                color: 'var(--accent-primary)',
              }}
            >
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-white group-hover:text-white block">
                Proxies
              </span>
            </div>
          </div>
          <ArrowRight
            className="w-5 h-5 transition-transform group-hover:translate-x-1"
            style={{ color: 'var(--accent-primary)' }}
          />
        </button>

        {/* Games Hyperlink */}
        <button
          onClick={() => onNavigate('games')}
          className="group relative flex items-center justify-between p-6 rounded-2xl border transition-all duration-200 cursor-pointer text-left"
          style={{
            backgroundColor: 'var(--accent-bg-card)',
            borderColor: 'var(--accent-border)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
            e.currentTarget.style.boxShadow = '0 0 25px var(--accent-glow)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-border)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl border flex items-center justify-center transition-all group-hover:scale-105"
              style={{
                backgroundColor: 'var(--accent-bg-soft)',
                borderColor: 'var(--accent-border)',
                color: 'var(--accent-primary)',
              }}
            >
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-white group-hover:text-white block">
                Games
              </span>
            </div>
          </div>
          <ArrowRight
            className="w-5 h-5 transition-transform group-hover:translate-x-1"
            style={{ color: 'var(--accent-primary)' }}
          />
        </button>
      </div>
    </div>
  );
};
