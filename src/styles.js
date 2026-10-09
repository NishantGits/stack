'use strict';

const baseCSS = `
/* ── Reset ─────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.65;
  min-height: 100vh;
  transition: background 0.35s ease, color 0.35s ease;
}

img, svg { display: block; max-width: 100%; }
a { color: var(--accent); text-decoration: none; transition: color 0.15s, opacity 0.15s; }
a:hover { color: var(--accent-hover); }

/* ── Typography ────────────────────────────────────────────── */
h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.03em;
  color: var(--text);
}
h1 { font-size: clamp(2.25rem, 5vw, 3.5rem); }
h2 { font-size: clamp(1.75rem, 3.5vw, 2.25rem); }
h3 { font-size: 1.35rem; }
h4 { font-size: 1.15rem; }

p { color: var(--text-muted); margin-bottom: 1rem; }
p:last-child { margin-bottom: 0; }

code, pre { font-family: var(--font-mono); font-size: 0.875em; }
code {
  background: var(--bg-muted);
  padding: 0.15em 0.45em;
  border-radius: 6px;
  color: var(--accent);
}
pre {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 1.25rem 1.4rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}
pre code { background: none; padding: 0; color: var(--text); }

/* ── Layout ────────────────────────────────────────────────── */
.container {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
.section { padding: 5.5rem 0; position: relative; }
.section-title { text-align: center; margin-bottom: 3.25rem; }
.section-title h2 { margin-bottom: 0.6rem; }
.section-title p {
  font-size: 1.125rem;
  max-width: 34rem;
  margin: 0 auto;
}

/* ── Navbar ────────────────────────────────────────────────── */
.stk-navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--bg) 78%, transparent);
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  border-bottom: 1px solid var(--border);
}
.stk-navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}
.stk-brand {
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 0.55rem;
  letter-spacing: -0.02em;
}
.stk-nav-links {
  display: flex;
  align-items: center;
  gap: 1.75rem;
  list-style: none;
}
.stk-nav-links a {
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 500;
  position: relative;
}
.stk-nav-links a::after {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: -4px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--accent), var(--accent-hover));
  transform: scaleX(0);
  transition: transform 0.2s ease;
}
.stk-nav-links a:hover { color: var(--text); }
.stk-nav-links a:hover::after { transform: scaleX(1); }

/* ── Hero ──────────────────────────────────────────────────── */
.stk-hero {
  padding: 7.5rem 0 5.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.stk-hero::before {
  content: '';
  position: absolute;
  inset: -20% -10% auto -10%;
  height: 80%;
  background:
    radial-gradient(ellipse 70% 60% at 50% 0%, color-mix(in srgb, var(--accent) 28%, transparent), transparent 70%),
    radial-gradient(ellipse 50% 40% at 80% 40%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%),
    radial-gradient(ellipse 40% 35% at 15% 50%, color-mix(in srgb, var(--accent) 8%, transparent), transparent 70%);
  pointer-events: none;
}
.stk-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 60%, var(--bg) 100%);
  pointer-events: none;
}
.stk-hero-content { position: relative; z-index: 1; }
.stk-hero h1 {
  font-size: clamp(2.5rem, 6.5vw, 4rem);
  margin-bottom: 1.35rem;
  background: linear-gradient(135deg, var(--text) 0%, var(--text) 40%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.stk-hero p {
  font-size: 1.2rem;
  max-width: 36rem;
  margin: 0 auto 2.5rem;
  line-height: 1.7;
}
.stk-hero-actions {
  display: flex;
  gap: 0.85rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* ── Buttons ───────────────────────────────────────────────── */
.stk-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 1.65rem;
  min-height: 44px;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
  text-decoration: none;
  font-family: inherit;
  letter-spacing: -0.01em;
  line-height: 1;
  white-space: nowrap;
  user-select: none;
}
.stk-btn:active { transform: translateY(0) scale(0.98); }

.stk-btn-primary {
  background: linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 75%, #fff) 50%, var(--accent-hover) 100%);
  background-size: 160% 160%;
  color: var(--accent-fg);
  box-shadow:
    0 1px 0 color-mix(in srgb, #fff 20%, transparent) inset,
    0 4px 14px color-mix(in srgb, var(--accent) 35%, transparent),
    0 1px 2px rgba(0,0,0,0.12);
}
.stk-btn-primary:hover {
  background-position: 100% 50%;
  transform: translateY(-2px);
  box-shadow:
    0 1px 0 color-mix(in srgb, #fff 25%, transparent) inset,
    0 8px 28px color-mix(in srgb, var(--accent) 45%, transparent),
    0 2px 6px rgba(0,0,0,0.14);
  color: var(--accent-fg);
}

.stk-btn-secondary {
  background: color-mix(in srgb, var(--bg-elevated) 80%, transparent);
  color: var(--text);
  border: 1px solid var(--border);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}
.stk-btn-secondary:hover {
  background: var(--bg-muted);
  border-color: color-mix(in srgb, var(--accent) 40%, var(--border));
  color: var(--text);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

/* ── Cards ─────────────────────────────────────────────────── */
.stk-card {
  background: linear-gradient(165deg, var(--bg-elevated) 0%, color-mix(in srgb, var(--bg-elevated) 88%, var(--bg-muted)) 100%);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.9rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  position: relative;
  overflow: hidden;
}
.stk-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 45%, transparent), transparent);
  opacity: 0;
  transition: opacity 0.25s;
}
.stk-card:hover {
  border-color: color-mix(in srgb, var(--accent) 35%, var(--border));
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}
.stk-card:hover::before { opacity: 1; }
.stk-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(145deg, color-mix(in srgb, var(--accent) 20%, transparent), color-mix(in srgb, var(--accent) 8%, transparent));
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.3rem;
  border: 1px solid color-mix(in srgb, var(--accent) 18%, transparent);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--accent) 12%, transparent);
}
.stk-card h3 { font-size: 1.1rem; margin-bottom: 0.45rem; letter-spacing: -0.02em; }
.stk-card p { font-size: 0.925rem; margin: 0; line-height: 1.6; }

/* ── Grid ──────────────────────────────────────────────────── */
.stk-grid { display: grid; gap: 1.35rem; }
.stk-grid-2 { grid-template-columns: repeat(2, 1fr); }
.stk-grid-3 { grid-template-columns: repeat(3, 1fr); }
.stk-grid-4 { grid-template-columns: repeat(4, 1fr); }

@media (max-width: 900px) {
  .stk-grid-3, .stk-grid-4 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .stk-grid-2, .stk-grid-3, .stk-grid-4 { grid-template-columns: 1fr; }
  .stk-nav-links { display: none; }
  .stk-hero { padding: 4.5rem 0 3rem; }
  .section { padding: 3.5rem 0; }
}

/* ── Counter ───────────────────────────────────────────────── */
.stk-counter {
  display: inline-flex;
  align-items: center;
  gap: 1.15rem;
  background: linear-gradient(160deg, var(--bg-elevated), var(--bg-muted));
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.85rem 1.35rem;
  box-shadow: var(--shadow);
}
.stk-counter-value {
  font-size: 1.85rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  min-width: 3ch;
  text-align: center;
  background: linear-gradient(135deg, var(--accent), var(--accent-hover));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.stk-counter button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  color: var(--text);
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s;
}
.stk-counter button:hover {
  background: linear-gradient(135deg, var(--accent), var(--accent-hover));
  color: var(--accent-fg);
  border-color: transparent;
  transform: scale(1.08);
  box-shadow: 0 4px 14px color-mix(in srgb, var(--accent) 35%, transparent);
}

/* ── Footer ────────────────────────────────────────────────── */
.stk-footer {
  border-top: 1px solid var(--border);
  padding: 2.75rem 0;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.875rem;
  background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--bg-muted) 40%, transparent));
}

/* ── Markdown ──────────────────────────────────────────────── */
.stk-md { max-width: 72ch; margin: 0 auto; }
.stk-md h1, .stk-md h2, .stk-md h3 { margin-top: 2em; margin-bottom: 0.75em; }
.stk-md h1:first-child, .stk-md h2:first-child { margin-top: 0; }
.stk-md ul, .stk-md ol { margin: 1rem 0; padding-left: 1.5rem; color: var(--text-muted); }
.stk-md li { margin-bottom: 0.4rem; }
.stk-md blockquote {
  border-left: 3px solid var(--accent);
  padding-left: 1.1rem;
  margin: 1.5rem 0;
  color: var(--text-muted);
  font-style: italic;
  background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 6%, transparent), transparent);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 0 8px 8px 0;
}

/* ── Icons ─────────────────────────────────────────────────── */
[data-lucide] { width: 1.25em; height: 1.25em; stroke-width: 1.75; }

/* ── Theme switcher ────────────────────────────────────────── */
.stk-theme-bar {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  gap: 0.45rem;
  z-index: 100;
  background: color-mix(in srgb, var(--bg-elevated) 90%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.45rem 0.55rem;
  box-shadow: var(--shadow-lg);
}
.stk-theme-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s;
  padding: 0;
}
.stk-theme-dot:hover { transform: scale(1.18); }
.stk-theme-dot.active {
  border-color: var(--text);
  box-shadow: 0 0 0 2px var(--bg), 0 0 0 3px var(--text);
}
`;

module.exports = { baseCSS };
