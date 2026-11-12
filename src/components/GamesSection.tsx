import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Gamepad2,
  Search,
  Maximize2,
  Minimize2,
  RotateCcw,
  ExternalLink,
  Sparkles,
  X,
  Play,
  Globe2,
  Layers,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { GameItem, resolveCoverUrl, resolveGameUrl, prepareGameHtml } from '../types/game';

export const GamesSection: React.FC = () => {
  const [games, setGames] = useState<GameItem[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [activeGame, setActiveGame] = useState<GameItem | null>(null);
  const [activeGameHtml, setActiveGameHtml] = useState<string>('');
  const [isLoadingGame, setIsLoadingGame] = useState(false);
  const [gameLoadError, setGameLoadError] = useState<string | null>(null);
  const [isPlayerFullscreen, setIsPlayerFullscreen] = useState(false);
  const [playerKey, setPlayerKey] = useState(0);
  const [viewMode, setViewMode] = useState<'icons' | 'raw_site'>('icons');
  const playerRef = useRef<HTMLDivElement | null>(null);

  // Load game catalog from local copy with CDN fallback
  useEffect(() => {
    let isMounted = true;

    const loadGames = async () => {
      try {
        const res = await fetch('/data/zones.json');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data)) {
            const filtered = data.filter((g: GameItem) => g.id !== -1 && g.name);
            setGames(filtered);
            setIsLoadingCatalog(false);
            return;
          }
        }
      } catch {
        // Fallback to CDN
      }

      try {
        const cdnRes = await fetch('https://cdn.jsdelivr.net/gh/freebuisness/assets@main/zones.json');
        if (cdnRes.ok) {
          const data = await cdnRes.json();
          if (isMounted && Array.isArray(data)) {
            const filtered = data.filter((g: GameItem) => g.id !== -1 && g.name);
            setGames(filtered);
          }
        }
      } catch (err) {
        console.error('Failed to load games catalog:', err);
      } finally {
        if (isMounted) setIsLoadingCatalog(false);
      }
    };

    loadGames();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch and prepare the HTML of the active game to render in srcDoc (bypassing text/plain MIME restrictions)
  const loadGameContent = async (game: GameItem) => {
    const rawUrl = resolveGameUrl(game.url);
    setIsLoadingGame(true);
    setGameLoadError(null);
    setActiveGameHtml('');

    try {
      const res = await fetch(rawUrl + (rawUrl.includes('?') ? '&' : '?') + 't=' + Date.now());
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const rawText = await res.text();
      const preparedHtml = prepareGameHtml(rawText, rawUrl);
      setActiveGameHtml(preparedHtml);
    } catch (err: any) {
      console.error('Failed to fetch game HTML:', err);
      setGameLoadError(err?.message || 'Could not load game files. Click Direct Open to play.');
    } finally {
      setIsLoadingGame(false);
    }
  };

  // Launch a game when clicked
  const handleSelectGame = (game: GameItem) => {
    setActiveGame(game);
    setPlayerKey((k) => k + 1);
    loadGameContent(game);
  };

  // Reload current game
  const handleReloadGame = () => {
    if (activeGame) {
      setPlayerKey((k) => k + 1);
      loadGameContent(activeGame);
    }
  };

  // Open game in about:blank cloaked tab with rendered HTML
  const handleOpenBlankTab = async (game: GameItem) => {
    const win = window.open('about:blank', '_blank');
    if (!win) {
      alert('Popup blocked. Please allow popups to open game in fullscreen blank tab.');
      return;
    }

    win.document.open();
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head><title>${game.name}</title></head>
      <body style="margin:0;padding:0;background:#000;color:#10b981;font-family:sans-serif;height:100vh;display:flex;align-items:center;justify-content:center;">
        <div>Loading ${game.name}...</div>
      </body>
      </html>
    `);
    win.document.close();

    const rawUrl = resolveGameUrl(game.url);
    try {
      const res = await fetch(rawUrl + (rawUrl.includes('?') ? '&' : '?') + 't=' + Date.now());
      const rawText = await res.text();
      const preparedHtml = prepareGameHtml(rawText, rawUrl);
      win.document.open();
      win.document.write(preparedHtml);
      win.document.close();
    } catch {
      win.location.href = rawUrl;
    }
  };

  // Filter games based on search and letter
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const name = (game.name || '').toLowerCase();
      const author = (game.author || '').toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch = !q || name.includes(q) || author.includes(q);
      if (!matchesSearch) return false;

      if (selectedLetter === 'ALL') return true;

      const firstChar = name.charAt(0).toUpperCase();
      if (selectedLetter === '#') {
        return !isNaN(parseInt(firstChar, 10));
      }
      return firstChar === selectedLetter;
    });
  }, [games, searchQuery, selectedLetter]);

  // Fullscreen Toggle for Game Player
  const togglePlayerFullscreen = () => {
    const el = playerRef.current as any;
    if (!isPlayerFullscreen) {
      setIsPlayerFullscreen(true);
      if (el) {
        if (el.requestFullscreen) {
          el.requestFullscreen().catch(() => {});
        } else if (el.webkitRequestFullscreen) {
          el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
          el.msRequestFullscreen();
        }
      }
    } else {
      setIsPlayerFullscreen(false);
      const doc = document as any;
      if (doc.fullscreenElement || doc.webkitFullscreenElement) {
        if (doc.exitFullscreen) {
          doc.exitFullscreen().catch(() => {});
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        }
      }
    }
  };

  // Keyboard escape listener for fullscreen
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPlayerFullscreen) {
          setIsPlayerFullscreen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlayerFullscreen]);

  // Sync state if user exits via browser ESC
  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as any;
      if (!doc.fullscreenElement && !doc.webkitFullscreenElement && isPlayerFullscreen) {
        setIsPlayerFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [isPlayerFullscreen]);

  const alphabet = ['ALL', '#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  return (
    <div className="space-y-6">
      {/* Top Banner & Search Controls */}
      <div
        className="backdrop-blur-md border rounded-2xl p-4 sm:p-5 shadow-xl transition-all"
        style={{
          backgroundColor: 'var(--accent-bg-card)',
          borderColor: 'var(--accent-border)',
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0"
              style={{
                backgroundColor: 'var(--accent-bg-soft)',
                borderColor: 'var(--accent-border)',
                color: 'var(--accent-primary)',
              }}
            >
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  GN-Math Games Catalog
                </h2>
                <span
                  className="px-2 py-0.5 rounded-full border text-[10px] font-mono"
                  style={{
                    backgroundColor: 'var(--accent-bg-soft)',
                    borderColor: 'var(--accent-border)',
                    color: 'var(--accent-primary)',
                  }}
                >
                  {games.length} Games
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: 'var(--accent-text)' }}>
                Every game from <span className="font-mono" style={{ color: 'var(--accent-primary)' }}>gn-math.dev</span> with its own separate icon.
              </p>
            </div>
          </div>

          {/* Search & View Switcher */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            {/* View Mode Toggle: Icons vs Original Site */}
            <div
              className="flex items-center border rounded-xl p-0.5"
              style={{
                backgroundColor: '#000000',
                borderColor: 'var(--accent-border)',
              }}
            >
              <button
                onClick={() => setViewMode('icons')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'icons'
                    ? 'font-bold shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
                style={
                  viewMode === 'icons'
                    ? {
                        backgroundColor: 'var(--accent-primary)',
                        color: '#000',
                      }
                    : {}
                }
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Game Icons</span>
              </button>
              <button
                onClick={() => setViewMode('raw_site')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'raw_site'
                    ? 'font-bold shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
                style={
                  viewMode === 'raw_site'
                    ? {
                        backgroundColor: 'var(--accent-primary)',
                        color: '#000',
                      }
                    : {}
                }
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>gn-math.dev/games.html</span>
              </button>
            </div>

            {/* Search Input */}
            {viewMode === 'icons' && (
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--accent-primary)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 850+ games..."
                  className="w-full bg-[#000000] border rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none"
                  style={{ borderColor: 'var(--accent-border)' }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-xs cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Alphabet Filter Bar (Icons mode) */}
        {viewMode === 'icons' && (
          <div
            className="mt-4 pt-3 border-t flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin"
            style={{ borderColor: 'var(--accent-border)' }}
          >
            {alphabet.map((letter) => {
              const isSelected = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all shrink-0 cursor-pointer ${
                    isSelected ? 'shadow-sm font-bold' : 'hover:text-white'
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: 'var(--accent-primary)',
                          color: '#000',
                          boxShadow: '0 0 8px var(--accent-glow)',
                        }
                      : {
                          backgroundColor: 'var(--accent-bg-soft)',
                          color: 'var(--accent-text)',
                          border: '1px solid var(--accent-border)',
                        }
                  }
                >
                  {letter}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Raw Site View (gn-math.dev/games.html) */}
      {viewMode === 'raw_site' && (
        <div
          className="relative border rounded-2xl overflow-hidden shadow-2xl"
          style={{
            backgroundColor: 'var(--body-bg)',
            borderColor: 'var(--accent-border)',
          }}
        >
          <div
            className="border-b px-4 py-2.5 flex items-center justify-between"
            style={{
              backgroundColor: 'var(--accent-bg-bar)',
              borderColor: 'var(--accent-border)',
            }}
          >
            <span className="text-xs font-mono" style={{ color: 'var(--accent-text)' }}>
              https://gn-math.dev/games.html
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://gn-math.dev/games.html"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-black font-bold px-3 py-1 rounded-lg cursor-pointer"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  boxShadow: '0 0 10px var(--accent-glow)',
                }}
              >
                <span>Direct Open</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <iframe
            src="https://gn-math.dev/games.html"
            title="GN-Math Games Portal"
            className="w-full h-[780px] border-0"
            allow="fullscreen; autoplay; clipboard-write; encrypted-media"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-downloads"
          />
        </div>
      )}

      {/* Separate Game Icons Grid */}
      {viewMode === 'icons' && (
        <>
          {isLoadingCatalog ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div
                className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin mb-3"
                style={{
                  borderColor: 'var(--accent-border)',
                  borderTopColor: 'var(--accent-primary)',
                }}
              />
              <p className="text-xs font-mono" style={{ color: 'var(--accent-text)' }}>Loading 850+ GN-Math game icons...</p>
            </div>
          ) : filteredGames.length === 0 ? (
            <div
              className="text-center py-20 border rounded-2xl"
              style={{
                backgroundColor: 'var(--accent-bg-card)',
                borderColor: 'var(--accent-border)',
              }}
            >
              <Gamepad2 className="w-10 h-10 mx-auto mb-3 opacity-40" style={{ color: 'var(--accent-primary)' }} />
              <h3 className="text-base font-bold text-white mb-1">No games found</h3>
              <p className="text-xs text-white/60">
                Try a different search query or click &apos;ALL&apos; in the letter filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3">
              {filteredGames.map((game) => {
                const coverUrl = resolveCoverUrl(game.cover);

                return (
                  <div
                    key={game.id}
                    onClick={() => handleSelectGame(game)}
                    className="group relative border rounded-xl p-2.5 transition-all duration-200 cursor-pointer flex flex-col shadow-lg hover:-translate-y-1"
                    style={{
                      backgroundColor: 'var(--accent-bg-card)',
                      borderColor: 'var(--accent-border)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-primary)';
                      e.currentTarget.style.boxShadow = '0 0 18px var(--accent-glow)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Game Cover Icon */}
                    <div
                      className="relative w-full aspect-square rounded-lg overflow-hidden border mb-2 flex items-center justify-center"
                      style={{
                        backgroundColor: '#000000',
                        borderColor: 'var(--accent-border)',
                      }}
                    >
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={game.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                            const parent = (e.target as HTMLElement).parentElement;
                            if (parent) {
                              const iconFallback = parent.querySelector('.cover-fallback');
                              if (iconFallback) iconFallback.classList.remove('hidden');
                            }
                          }}
                        />
                      ) : null}

                      {/* Fallback Icon */}
                      <div className={`cover-fallback ${coverUrl ? 'hidden' : ''} flex flex-col items-center justify-center opacity-40`} style={{ color: 'var(--accent-primary)' }}>
                        <Gamepad2 className="w-8 h-8" />
                      </div>

                      {/* Hover Overlay with Play Button */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <div
                          className="w-10 h-10 rounded-full text-black flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform"
                          style={{
                            backgroundColor: 'var(--accent-primary)',
                            boxShadow: '0 0 15px var(--accent-glow)',
                          }}
                        >
                          <Play className="w-5 h-5 fill-black ml-0.5" />
                        </div>
                      </div>

                      {/* Special Tag Badge */}
                      {game.special && (
                        <span
                          className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase text-black shadow"
                          style={{ backgroundColor: 'var(--accent-primary)' }}
                        >
                          {game.special}
                        </span>
                      )}
                    </div>

                    {/* Game Title */}
                    <h4
                      title={game.name}
                      className="text-xs font-bold text-white truncate transition-colors text-center"
                    >
                      {game.name}
                    </h4>

                    {/* Author or Info */}
                    <p className="text-[10px] truncate text-center mt-0.5 font-mono" style={{ color: 'var(--accent-text)' }}>
                      {game.author || 'GN-Math'}
                    </p>

                    {/* Quick Launch Buttons on Bottom */}
                    <div
                      className="mt-2 pt-1.5 border-t flex items-center justify-between text-[10px]"
                      style={{ borderColor: 'var(--accent-border)' }}
                    >
                      <span className="font-semibold" style={{ color: 'var(--accent-primary)' }}>
                        Play Game
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenBlankTab(game);
                        }}
                        title="Open in Fullscreen Blank Tab"
                        className="p-1 rounded hover:text-white transition-colors cursor-pointer"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Embedded Game Player Modal / Viewport Container */}
      {activeGame && (
        <div
          ref={playerRef}
          className={`border rounded-2xl overflow-hidden shadow-2xl transition-all ${
            isPlayerFullscreen
              ? 'fixed inset-0 z-[999999] w-screen h-screen rounded-none flex flex-col bg-black'
              : 'fixed inset-4 sm:inset-8 z-50 flex flex-col'
          }`}
          style={{
            backgroundColor: '#000000',
            borderColor: 'var(--accent-primary)',
            boxShadow: '0 0 35px var(--accent-glow)',
          }}
        >
          {/* Player Toolbar */}
          <div
            className="border-b px-4 py-2.5 flex items-center justify-between gap-3 shrink-0"
            style={{
              backgroundColor: 'var(--accent-bg-bar)',
              borderColor: 'var(--accent-border)',
            }}
          >
            {/* Left: Game Title and Back */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsPlayerFullscreen(false);
                  setActiveGame(null);
                  setActiveGameHtml('');
                }}
                className="flex items-center gap-1 text-xs font-semibold text-white/90 hover:text-white px-2.5 py-1 rounded-lg border transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--accent-bg-soft)',
                  borderColor: 'var(--accent-border)',
                }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-primary)' }} />
                <h3 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                  {activeGame.name}
                </h3>
              </div>
            </div>

            {/* Right: Controls (Reload, Popout, Fullscreen, Close) */}
            <div className="flex items-center gap-2">
              {/* Reload Button */}
              <button
                onClick={handleReloadGame}
                title="Reload Game"
                className="p-1.5 rounded-lg border text-white/90 hover:text-white transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--accent-bg-soft)',
                  borderColor: 'var(--accent-border)',
                }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Blank Cloak Fullscreen Tab */}
              <button
                onClick={() => handleOpenBlankTab(activeGame)}
                title="Launch in Fullscreen Blank Tab (about:blank cloak)"
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--accent-bg-soft)',
                  borderColor: 'var(--accent-border)',
                  color: 'var(--accent-text)',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                <span className="hidden sm:inline">True Fullscreen Tab</span>
              </button>

              {/* Toggle Fullscreen Viewport */}
              <button
                onClick={togglePlayerFullscreen}
                title={isPlayerFullscreen ? 'Exit Fullscreen (Esc)' : 'Expand Fullscreen Viewport'}
                className="flex items-center gap-1 px-3 py-1 rounded-lg text-black text-xs font-bold transition-all cursor-pointer"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  boxShadow: '0 0 12px var(--accent-glow)',
                }}
              >
                {isPlayerFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Exit Fullscreen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Fullscreen</span>
                  </>
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  setIsPlayerFullscreen(false);
                  setActiveGame(null);
                  setActiveGameHtml('');
                }}
                title="Close Game Player"
                className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/70 border border-red-500/40 text-red-300 hover:text-white transition-colors cursor-pointer ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Player View Container */}
          <div className="relative flex-1 w-full bg-black flex items-center justify-center overflow-hidden">
            {isLoadingGame ? (
              <div className="flex flex-col items-center justify-center p-8">
                <div
                  className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin mb-4"
                  style={{
                    borderColor: 'var(--accent-border)',
                    borderTopColor: 'var(--accent-primary)',
                  }}
                />
                <p className="text-sm font-semibold text-white">Loading {activeGame.name}...</p>
                <p className="text-xs mt-1 font-mono" style={{ color: 'var(--accent-text)' }}>
                  Injecting HTML5 runtime & assets
                </p>
              </div>
            ) : gameLoadError ? (
              <div className="text-center p-6 max-w-md bg-black/60 border border-red-500/40 rounded-2xl">
                <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white mb-1">Failed to embed game</h4>
                <p className="text-xs text-white/70 mb-4">{gameLoadError}</p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleReloadGame}
                    className="px-3.5 py-1.5 border text-xs rounded-xl hover:text-white"
                    style={{
                      backgroundColor: 'var(--accent-bg-soft)',
                      borderColor: 'var(--accent-border)',
                      color: 'var(--accent-text)',
                    }}
                  >
                    Retry
                  </button>
                  <button
                    onClick={() => handleOpenBlankTab(activeGame)}
                    className="px-4 py-1.5 text-black font-bold text-xs rounded-xl cursor-pointer"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      boxShadow: '0 0 10px var(--accent-glow)',
                    }}
                  >
                    Launch in Blank Tab
                  </button>
                </div>
              </div>
            ) : activeGameHtml ? (
              <iframe
                key={playerKey}
                srcDoc={activeGameHtml}
                title={activeGame.name}
                className="w-full h-full border-0"
                allow="fullscreen; autoplay; clipboard-write; encrypted-media; picture-in-picture; cross-origin-isolated"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-downloads allow-pointer-lock"
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
