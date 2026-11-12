import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  decay: number;
}

interface StarBackgroundProps {
  enabled?: boolean;
  speedMultiplier?: number;
  themeId?: string;
}

export const StarBackground: React.FC<StarBackgroundProps> = ({
  enabled = true,
  speedMultiplier = 1,
  themeId = 'emerald',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // ==========================================
    // MATRIX DIGITAL RAIN MODE (when themeId === 'matrix')
    // ==========================================
    if (themeId === 'matrix') {
      const chars = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ'.split('');
      const fontSize = 15;
      let columns = Math.floor(width / fontSize);
      let drops: number[] = [];

      const initMatrix = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        columns = Math.floor(width / fontSize);
        drops = [];
        for (let i = 0; i < columns; i++) {
          drops[i] = Math.floor(Math.random() * -height / fontSize);
        }
      };

      initMatrix();
      window.addEventListener('resize', initMatrix);

      let lastTime = 0;
      const targetFps = 30 * speedMultiplier;
      const frameInterval = 1000 / targetFps;

      const renderMatrix = (timestamp: number) => {
        if (!lastTime) lastTime = timestamp;
        const elapsed = timestamp - lastTime;

        if (elapsed > frameInterval) {
          lastTime = timestamp - (elapsed % frameInterval);

          // Dark fading trail
          ctx.fillStyle = 'rgba(1, 8, 2, 0.12)';
          ctx.fillRect(0, 0, width, height);

          ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

          for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            // Draw glowing head character
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#4ade80';
            ctx.shadowBlur = 8;
            ctx.fillText(char, x, y);

            // Trailing green
            ctx.fillStyle = '#22c55e';
            ctx.shadowBlur = 0;
            ctx.fillText(char, x, y - fontSize);

            if (y > height && Math.random() > 0.975) {
              drops[i] = 0;
            }
            drops[i]++;
          }
        }

        animationFrameId = requestAnimationFrame(renderMatrix);
      };

      animationFrameId = requestAnimationFrame(renderMatrix);

      return () => {
        window.removeEventListener('resize', initMatrix);
        cancelAnimationFrame(animationFrameId);
      };
    }

    // ==========================================
    // STARFIELD & NEBULA MODE (for other themes)
    // ==========================================
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX - width / 2) * 0.03;
      targetY = (e.clientY - height / 2) * 0.03;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Color definitions per theme
    const getThemeColors = () => {
      switch (themeId) {
        case 'ocean':
          return {
            stars: ['#ffffff', '#a5f3fc', '#67e8f9', '#06b6d4', '#0891b2'],
            nebulaPrimary: 'rgba(8, 47, 73, 0.45)',
            nebulaSecondary: 'rgba(6, 182, 212, 0.1)',
            shootingColor: '#06b6d4',
          };
        case 'amethyst':
          return {
            stars: ['#ffffff', '#f3e8ff', '#d8b4fe', '#a855f7', '#9333ea'],
            nebulaPrimary: 'rgba(59, 7, 100, 0.45)',
            nebulaSecondary: 'rgba(168, 85, 247, 0.1)',
            shootingColor: '#a855f7',
          };
        case 'crimson':
          return {
            stars: ['#ffffff', '#fee2e2', '#fca5a5', '#ef4444', '#dc2626'],
            nebulaPrimary: 'rgba(69, 10, 10, 0.45)',
            nebulaSecondary: 'rgba(239, 68, 68, 0.1)',
            shootingColor: '#ef4444',
          };
        case 'midnight':
          return {
            stars: ['#ffffff', '#f1f5f9', '#cbd5e1', '#94a3b8', '#64748b'],
            nebulaPrimary: 'rgba(30, 41, 59, 0.4)',
            nebulaSecondary: 'rgba(148, 163, 184, 0.08)',
            shootingColor: '#94a3b8',
          };
        case 'emerald':
        default:
          return {
            stars: ['#ffffff', '#a7f3d0', '#34d399', '#10b981', '#6ee7b7'],
            nebulaPrimary: 'rgba(6, 44, 23, 0.38)',
            nebulaSecondary: 'rgba(16, 185, 129, 0.1)',
            shootingColor: '#10b981',
          };
      }
    };

    const themeColors = getThemeColors();

    let stars: Star[] = [];
    const initStars = () => {
      stars = [];
      const count = Math.floor((width * height) / 3800);
      for (let i = 0; i < count; i++) {
        const size = Math.random() < 0.85 ? Math.random() * 1.5 + 0.5 : Math.random() * 2.5 + 1.2;
        const baseAlpha = Math.random() * 0.7 + 0.2;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          baseAlpha,
          alpha: baseAlpha,
          twinkleSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1) * speedMultiplier,
          color: themeColors.stars[Math.floor(Math.random() * themeColors.stars.length)],
        });
      }
    };

    initStars();

    const shootingStars: ShootingStar[] = [];
    let nextShootingStarTime = Date.now() + Math.random() * 3000 + 2000;

    const addShootingStar = () => {
      const startX = Math.random() * width;
      const startY = Math.random() * (height * 0.6);
      shootingStars.push({
        x: startX,
        y: startY,
        length: Math.random() * 80 + 70,
        speed: (Math.random() * 7 + 8) * speedMultiplier,
        angle: (Math.PI / 4) + (Math.random() * 0.2 - 0.1),
        alpha: 1,
        decay: (Math.random() * 0.015 + 0.01) * speedMultiplier,
      });
      nextShootingStarTime = Date.now() + (Math.random() * 5000 + 3000) / speedMultiplier;
    };

    const renderStars = () => {
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Deep space nebula glow
      const grad = ctx.createRadialGradient(
        width * 0.5 + mouseX * 2,
        height * 0.3 + mouseY * 2,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      grad.addColorStop(0, themeColors.nebulaPrimary);
      grad.addColorStop(0.5, 'rgba(4, 15, 8, 0.3)');
      grad.addColorStop(1, 'rgba(2, 5, 3, 1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Ambient corner glow
      const subGrad = ctx.createRadialGradient(
        width * 0.85,
        height * 0.9,
        10,
        width * 0.85,
        height * 0.9,
        width * 0.5
      );
      subGrad.addColorStop(0, themeColors.nebulaSecondary);
      subGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = subGrad;
      ctx.fillRect(0, 0, width, height);

      // Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        star.alpha += star.twinkleSpeed;
        if (star.alpha > 0.95) {
          star.alpha = 0.95;
          star.twinkleSpeed = -Math.abs(star.twinkleSpeed);
        } else if (star.alpha < 0.15) {
          star.alpha = 0.15;
          star.twinkleSpeed = Math.abs(star.twinkleSpeed);
        }

        const px = star.x + mouseX * (star.size * 0.3);
        const py = star.y + mouseY * (star.size * 0.3);

        ctx.save();
        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = star.color;

        if (star.size > 1.8) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = themeColors.shootingColor;
        }

        ctx.beginPath();
        ctx.arc(px, py, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (Date.now() > nextShootingStarTime) {
        addShootingStar();
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha -= s.decay;

        if (s.alpha <= 0 || s.x > width + 100 || s.y > height + 100) {
          shootingStars.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.lineWidth = 1.8;
        ctx.shadowBlur = 10;
        ctx.shadowColor = themeColors.shootingColor;

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const starGrad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        starGrad.addColorStop(0, `rgba(255, 255, 255, ${s.alpha})`);
        starGrad.addColorStop(0.3, `${themeColors.shootingColor}`);
        starGrad.addColorStop(1, 'transparent');

        ctx.strokeStyle = starGrad;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(renderStars);
    };

    animationFrameId = requestAnimationFrame(renderStars);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled, speedMultiplier, themeId]);

  if (!enabled) {
    return <div className="fixed inset-0 pointer-events-none z-0" style={{ background: 'var(--body-bg)' }} />;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ display: 'block' }}
    />
  );
};
