import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  RotateCcw,
  Maximize2,
  Sparkles,
  Lock,
  Globe2,
} from 'lucide-react';
import { openInAboutBlank } from '../utils/cloak';

interface ProxyService {
  id: string;
  name: string;
  url: string;
}

const PROXIES: ProxyService[] = [
  {
    id: 'frogies',
    name: "Frogie's Arcade",
    url: 'https://frogiesarcade.com/',
  },
  {
    id: 'tungtung',
    name: 'Tung Tung',
    url: 'https://tungtung.top/',
  },
  {
    id: 'moving-companies',
    name: 'Moving Companies',
    url: 'https://moving-companies-near-me.cfd/',
  },
];

export const ProxiesSection: React.FC = () => {
  const [selectedProxyId, setSelectedProxyId] = useState<string>(PROXIES[0].id);
  const [customUrl, setCustomUrl] = useState<string>('');
  const [activeUrl, setActiveUrl] = useState<string>(PROXIES[0].url);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isFullscreenFrame, setIsFullscreenFrame] = useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  const handleSelectProxy = (proxy: ProxyService) => {
    setSelectedProxyId(proxy.id);
    setActiveUrl(proxy.url);
    setHasLoaded(false);
    setIframeKey((prev) => prev + 1);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreenFrame) {
        setIsFullscreenFrame(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isFullscreenFrame]);

  const handleCustomGo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    let url = customUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    setSelectedProxyId('custom');
    setActiveUrl(url);
    setHasLoaded(false);
    setIframeKey((prev) => prev + 1);
  };

  const reloadFrame = () => {
    setHasLoaded(false);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-3">
      {/* Sleek Minimalist Proxy Switcher & URL Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* 3 Clean Proxy Tabs */}
        <div
          className="flex items-center gap-1.5 p-1 rounded-xl border overflow-x-auto"
          style={{
            backgroundColor: 'var(--accent-bg-card)',
            borderColor: 'var(--accent-border)',
          }}
        >
          {PROXIES.map((proxy) => {
            const isSelected = selectedProxyId === proxy.id;
            return (
              <button
                key={proxy.id}
                onClick={() => handleSelectProxy(proxy)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected ? 'font-bold' : 'text-white/70 hover:text-white'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: 'var(--accent-primary)',
                        color: '#000000',
                        boxShadow: '0 0 12px var(--accent-glow)',
                      }
                    : {}
                }
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>{proxy.name}</span>
              </button>
            );
          })}
        </div>

        {/* Compact URL Search/Load */}
        <form onSubmit={handleCustomGo} className="flex items-center gap-1.5 max-w-sm w-full">
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Enter custom URL..."
            className="flex-1 bg-[#000000] border rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none"
            style={{ borderColor: 'var(--accent-border)' }}
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl text-black font-semibold text-xs transition-colors shrink-0 cursor-pointer"
            style={{
              backgroundColor: 'var(--accent-primary)',
              boxShadow: '0 0 8px var(--accent-glow)',
            }}
          >
            Go
          </button>
        </form>
      </div>

      {/* Embedded Proxy Browser Window */}
      <div
        className={`relative border rounded-2xl overflow-hidden shadow-2xl transition-all ${
          isFullscreenFrame
            ? 'fixed inset-0 z-[100] w-screen h-screen rounded-none flex flex-col bg-black'
            : 'w-full'
        }`}
        style={{
          backgroundColor: 'var(--body-bg)',
          borderColor: 'var(--accent-border)',
        }}
      >
        {/* Browser Top Navigation Bar */}
        <div
          className="border-b px-3.5 py-2 flex flex-wrap items-center justify-between gap-2.5"
          style={{
            backgroundColor: 'var(--accent-bg-bar)',
            borderColor: 'var(--accent-border)',
          }}
        >
          {/* Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={reloadFrame}
              title="Reload Frame"
              className="p-1.5 rounded-lg border text-white/80 hover:text-white transition-colors cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-bg-soft)',
                borderColor: 'var(--accent-border)',
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <div
              className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md border"
              style={{
                backgroundColor: 'rgba(0,0,0,0.4)',
                borderColor: 'var(--accent-border)',
                color: 'var(--accent-text)',
              }}
            >
              <Lock className="w-3 h-3" style={{ color: 'var(--accent-primary)' }} />
              <span>SSL</span>
            </div>
          </div>

          {/* URL Display */}
          <div className="flex-1 min-w-[160px] max-w-md mx-auto">
            <div
              className="flex items-center gap-1.5 border rounded-lg px-2.5 py-1 text-xs font-mono truncate"
              style={{
                backgroundColor: '#000000',
                borderColor: 'var(--accent-border)',
                color: 'var(--accent-text)',
              }}
            >
              <span className="select-none text-[11px]" style={{ color: 'var(--accent-primary)' }}>https://</span>
              <span className="truncate text-white/90">{activeUrl.replace(/^https?:\/\//, '')}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => openInAboutBlank(activeUrl)}
              title="Open in about:blank cloaked tab"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-bg-soft)',
                borderColor: 'var(--accent-border)',
                color: 'var(--accent-text)',
              }}
            >
              <Sparkles className="w-3 h-3" style={{ color: 'var(--accent-primary)' }} />
              <span className="hidden sm:inline">Blank Tab</span>
            </button>

            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open directly in new browser tab"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-black text-xs font-bold transition-all cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-primary)',
                boxShadow: '0 0 8px var(--accent-glow)',
              }}
            >
              <span>Direct</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={() => setIsFullscreenFrame(!isFullscreenFrame)}
              title={isFullscreenFrame ? 'Exit Fullscreen (Esc)' : 'Expand Fullscreen'}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-bg-soft)',
                borderColor: 'var(--accent-border)',
                color: 'var(--accent-text)',
              }}
            >
              <Maximize2 className="w-3 h-3" style={{ color: 'var(--accent-primary)' }} />
              <span>{isFullscreenFrame ? 'Exit' : 'Fullscreen'}</span>
            </button>
          </div>
        </div>

        {/* Embedded Iframe Container */}
        <div
          className={`relative w-full bg-black ${
            isFullscreenFrame ? 'flex-1 h-full' : 'h-[780px]'
          }`}
        >
          {!hasLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
              <div
                className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mb-2.5"
                style={{
                  borderColor: 'var(--accent-border)',
                  borderTopColor: 'var(--accent-primary)',
                }}
              />
              <p className="text-xs font-mono animate-pulse" style={{ color: 'var(--accent-primary)' }}>
                Connecting to {activeUrl.replace(/^https?:\/\//, '').split('/')[0]}...
              </p>
            </div>
          )}

          <iframe
            key={iframeKey}
            src={activeUrl}
            title="Web Proxy Gateway"
            className="w-full h-full border-0"
            allow="fullscreen; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-downloads"
            onLoad={() => setHasLoaded(true)}
          />
        </div>
      </div>
    </div>
  );
};
