import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Technology Nodes ───
const TECH_NODES = [
  { label: 'React', color: '#61DAFB', group: 'frontend' },
  { label: 'Astro', color: '#FF5D01', group: 'frontend' },
  { label: 'JavaScript', color: '#F7DF1E', group: 'frontend' },
  { label: 'HTML/CSS', color: '#E34F26', group: 'frontend' },
  { label: 'Tailwind', color: '#06B6D4', group: 'frontend' },
  { label: 'Three.js', color: '#000000', group: 'frontend' },
  { label: 'SEO', color: '#4285F4', group: 'marketing' },
  { label: 'Google Ads', color: '#FBBC04', group: 'marketing' },
  { label: 'Analytics', color: '#E37400', group: 'marketing' },
  { label: 'Meta Ads', color: '#0081FB', group: 'marketing' },
  { label: 'Node.js', color: '#339933', group: 'backend' },
  { label: 'Git', color: '#F05032', group: 'backend' },
  { label: 'APIs', color: '#6C63FF', group: 'backend' },
  { label: 'Figma', color: '#A259FF', group: 'design' },
  { label: 'UX/UI', color: '#FF6B9D', group: 'design' },
];

const GROUP_COLORS = {
  frontend: '#E11D48',
  marketing: '#FCD34D',
  backend: '#22C55E',
  design: '#A855F7',
};

const GROUP_LABELS = {
  frontend: 'Frontend',
  marketing: 'Marketing',
  backend: 'Backend',
  design: 'Diseño',
};

// ─── Stats ───
const STATS = [
  { label: 'Proyectos', value: 15, suffix: '+' },
  { label: 'Clientes', value: 10, suffix: '+' },
  { label: 'Tecnologías', value: 15, suffix: '' },
  { label: 'Café ☕', value: 999, suffix: '+' },
];

// ─── Particle Class ───
class Particle {
  constructor(canvas, techNode, index, total) {
    this.canvas = canvas;
    this.tech = techNode;
    this.index = index;

    // Distribute in a circular pattern with some randomness
    const angle = (index / total) * Math.PI * 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.3 + (Math.random() - 0.5) * 80;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    this.x = cx + Math.cos(angle) * radius;
    this.y = cy + Math.sin(angle) * radius;
    this.baseX = this.x;
    this.baseY = this.y;
    this.size = techNode ? 6 : 2 + Math.random() * 2;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.orbitSpeed = 0.002 + Math.random() * 0.003;
    this.orbitRadius = 15 + Math.random() * 25;
    this.angle = angle;
    this.glowIntensity = 0;
    this.isHovered = false;
  }

  update(mouseX, mouseY, time) {
    // Orbital movement around base position
    this.angle += this.orbitSpeed;
    const targetX = this.baseX + Math.cos(this.angle) * this.orbitRadius;
    const targetY = this.baseY + Math.sin(this.angle) * this.orbitRadius;

    // Mouse interaction
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const mouseRadius = 150;

    if (dist < mouseRadius && dist > 0) {
      const force = (mouseRadius - dist) / mouseRadius;
      const repelX = -(dx / dist) * force * 3;
      const repelY = -(dy / dist) * force * 3;
      this.x += (targetX - this.x) * 0.02 + repelX;
      this.y += (targetY - this.y) * 0.02 + repelY;
      this.glowIntensity = Math.min(1, this.glowIntensity + 0.1);
    } else {
      this.x += (targetX - this.x) * 0.03;
      this.y += (targetY - this.y) * 0.03;
      this.glowIntensity = Math.max(0, this.glowIntensity - 0.02);
    }

    // Hover detection (for tech nodes)
    this.isHovered = dist < 30 && this.tech;

    // Pulse
    this.pulsePhase += 0.03;
  }

  draw(ctx, time) {
    const pulse = 1 + Math.sin(this.pulsePhase) * 0.15;
    const size = this.size * pulse;
    const color = this.tech ? this.tech.color : '#a1a1aa';

    // Glow effect
    if (this.glowIntensity > 0 || this.tech) {
      const glowSize = this.tech ? 20 : 8;
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowSize * (1 + this.glowIntensity));
      gradient.addColorStop(0, color + (this.tech ? '60' : '30'));
      gradient.addColorStop(1, color + '00');
      ctx.beginPath();
      ctx.arc(this.x, this.y, glowSize * (1 + this.glowIntensity), 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Core
    ctx.beginPath();
    ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Border for tech nodes
    if (this.tech) {
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Label for hovered tech
    if (this.isHovered && this.tech) {
      ctx.save();
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.textAlign = 'center';

      const label = this.tech.label;
      const labelWidth = ctx.measureText(label).width + 20;

      // Background pill
      const pillX = this.x - labelWidth / 2;
      const pillY = this.y - 35;
      const pillH = 26;
      const pillR = 8;

      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, labelWidth, pillH, pillR);
      ctx.fill();

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, labelWidth, pillH, pillR);
      ctx.stroke();

      // Text
      ctx.fillStyle = '#fff';
      ctx.fillText(label, this.x, this.y - 18);
      ctx.restore();
    }
  }
}

// ─── Background Particle (smaller, ambient) ───
class BgParticle {
  constructor(canvas) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = 1 + Math.random() * 1.5;
    this.speedX = (Math.random() - 0.5) * 0.2;
    this.speedY = (Math.random() - 0.5) * 0.2;
    this.opacity = 0.2 + Math.random() * 0.3;
    this.canvas = canvas;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0) this.x = this.canvas.width;
    if (this.x > this.canvas.width) this.x = 0;
    if (this.y < 0) this.y = this.canvas.height;
    if (this.y > this.canvas.height) this.y = 0;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(161, 161, 170, ${this.opacity})`;
    ctx.fill();
  }
}

// ─── Counter Hook ───
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const startTime = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!start) return;
    startTime.current = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [start, target, duration]);

  return count;
}

// ─── Stat Counter Component ───
function StatCounter({ label, value, suffix, isVisible }) {
  const count = useCountUp(value, 2000, isVisible);
  return (
    <div className="lab-stat">
      <span className="lab-stat-value">
        {count}{suffix}
      </span>
      <span className="lab-stat-label">{label}</span>
    </div>
  );
}

// ─── Main Component ───
export default function DigitalLab() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const bgParticlesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animFrameRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Visibility observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Check mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Canvas setup & animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const container = canvas.parentElement;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = container.offsetWidth * dpr;
      canvas.height = container.offsetHeight * dpr;
      canvas.style.width = container.offsetWidth + 'px';
      canvas.style.height = container.offsetHeight + 'px';
      ctx.scale(dpr, dpr);

      // Re-init particles
      initParticles(container.offsetWidth, container.offsetHeight);
    };

    const initParticles = (w, h) => {
      // Tech particles
      const tempCanvas = { width: w, height: h };
      particlesRef.current = TECH_NODES.map(
        (tech, i) => new Particle(tempCanvas, tech, i, TECH_NODES.length)
      );

      // Background ambient particles
      const bgCount = isMobile ? 30 : 60;
      bgParticlesRef.current = Array.from(
        { length: bgCount },
        () => new BgParticle(tempCanvas)
      );
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking (relative to canvas)
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleTouchMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouseRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.016;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, w, h);

      // Update & draw bg particles
      bgParticlesRef.current.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      // Update tech particles
      particlesRef.current.forEach((p) => {
        p.update(mouseRef.current.x, mouseRef.current.y, time);
      });

      // Draw connections between tech nodes
      const particles = particlesRef.current;
      const connectionDist = isMobile ? 120 : 160;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const opacity = (1 - dist / connectionDist) * 0.4;
            const sameGroup = a.tech && b.tech && a.tech.group === b.tech.group;

            // Highlight connections for active group
            const isActiveConnection = activeGroup &&
              a.tech?.group === activeGroup && b.tech?.group === activeGroup;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);

            if (isActiveConnection) {
              ctx.strokeStyle = GROUP_COLORS[activeGroup] + 'AA';
              ctx.lineWidth = 2;
            } else if (sameGroup) {
              const groupColor = GROUP_COLORS[a.tech.group] || '#a1a1aa';
              ctx.strokeStyle = groupColor + Math.round(opacity * 255).toString(16).padStart(2, '0');
              ctx.lineWidth = 1.5;
            } else {
              ctx.strokeStyle = `rgba(161, 161, 170, ${opacity * 0.5})`;
              ctx.lineWidth = 0.5;
            }

            ctx.stroke();
          }
        }
      }

      // Draw particles on top
      particles.forEach((p) => p.draw(ctx, time));

      // Center pulse ring
      const cx = w / 2;
      const cy = h / 2;
      const ringRadius = 8 + Math.sin(time * 2) * 3;
      const ringGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, ringRadius + 15);
      ringGradient.addColorStop(0, 'rgba(225, 29, 72, 0.3)');
      ringGradient.addColorStop(1, 'rgba(225, 29, 72, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius + 15, 0, Math.PI * 2);
      ctx.fillStyle = ringGradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#E11D48';
      ctx.fill();
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 2;
      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMobile, activeGroup]);

  return (
    <section id="lab" className="lab-section reveal" ref={containerRef}>
      <div className="lab-container">
        {/* Header */}
        <div className="lab-header">
          <span className="lab-badge">LAB</span>
          <h2 className="lab-title">MI STACK <span className="lab-title-accent">TECNOLÓGICO</span></h2>
          <p className="lab-subtitle">
            Mueve el cursor sobre la constelación para explorar las tecnologías con las que trabajo. Cada nodo es una herramienta que domino.
          </p>
        </div>

        {/* Group Filters */}
        <div className="lab-filters">
          <button
            className={`lab-filter-btn ${activeGroup === null ? 'active' : ''}`}
            onClick={() => setActiveGroup(null)}
          >
            Todos
          </button>
          {Object.entries(GROUP_LABELS).map(([key, label]) => (
            <button
              key={key}
              className={`lab-filter-btn ${activeGroup === key ? 'active' : ''}`}
              onClick={() => setActiveGroup(activeGroup === key ? null : key)}
              style={{
                '--filter-color': GROUP_COLORS[key],
              }}
            >
              <span
                className="lab-filter-dot"
                style={{ background: GROUP_COLORS[key] }}
              />
              {label}
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div className="lab-canvas-wrapper">
          <canvas ref={canvasRef} className="lab-canvas" />
          {/* Corner decorations */}
          <div className="lab-corner lab-corner-tl">⟨</div>
          <div className="lab-corner lab-corner-tr">⟩</div>
          <div className="lab-corner lab-corner-bl">⟨</div>
          <div className="lab-corner lab-corner-br">⟩</div>
          {/* Scan line effect */}
          <div className="lab-scanline" />
        </div>

        {/* Stats */}
        <div className="lab-stats">
          {STATS.map((stat) => (
            <StatCounter
              key={stat.label}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Tech Tags (visible list below canvas) */}
        <div className="lab-tech-tags">
          {TECH_NODES.map((tech) => (
            <span
              key={tech.label}
              className={`lab-tech-tag ${activeGroup && activeGroup !== tech.group ? 'dimmed' : ''}`}
              style={{ '--tag-color': tech.color }}
              onMouseEnter={() => setActiveGroup(tech.group)}
              onMouseLeave={() => setActiveGroup(null)}
            >
              <span className="lab-tech-tag-dot" style={{ background: tech.color }} />
              {tech.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
