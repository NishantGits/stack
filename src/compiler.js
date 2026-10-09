'use strict';
const fs = require('fs');
const { getThemeCSS, themes } = require('./themes');
const { baseCSS } = require('./styles');

function simpleMarkdown(src) {
  let text = src.replace(/\r\n/g, '\n').trim();
  text = text.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return `<pre><code class="language-${lang||'text'}">${escaped}</code></pre>`;
  });
  text = text.replace(/^######\s+(.+)$/gm,'<h6>$1</h6>');
  text = text.replace(/^#####\s+(.+)$/gm,'<h5>$1</h5>');
  text = text.replace(/^####\s+(.+)$/gm,'<h4>$1</h4>');
  text = text.replace(/^###\s+(.+)$/gm,'<h3>$1</h3>');
  text = text.replace(/^##\s+(.+)$/gm,'<h2>$1</h2>');
  text = text.replace(/^#\s+(.+)$/gm,'<h1>$1</h1>');
  text = text.replace(/^---$/gm,'<hr>');
  text = text.replace(/^>\s+(.+)$/gm,'<blockquote>$1</blockquote>');
  text = text.replace(/((?:^[-*+]\s+.+$\n?)+)/gm, (block) => {
    const items = block.trim().split('\n').map(l => `<li>${l.replace(/^[-*+]\s+/,'')}</li>`).join('');
    return `<ul>${items}</ul>`;
  });
  text = text.replace(/((?:^\d+\.\s+.+$\n?)+)/gm, (block) => {
    const items = block.trim().split('\n').map(l => `<li>${l.replace(/^\d+\.\s+/,'')}</li>`).join('');
    return `<ol>${items}</ol>`;
  });
  text = text.replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em>$1</em></strong>');
  text = text.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g,'<em>$1</em>');
  text = text.replace(/`([^`]+)`/g,'<code>$1</code>');
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>');
  const lines = text.split('\n'); const out = []; let para = [];
  for (const line of lines) {
    if (line.trim() === '') { if (para.length) { out.push(`<p>${para.join(' ')}</p>`); para = []; } }
    else if (/^<\/?(h[1-6]|ul|ol|li|pre|blockquote|hr|p)/.test(line.trim())) { if (para.length) { out.push(`<p>${para.join(' ')}</p>`); para = []; } out.push(line); }
    else para.push(line.trim());
  }
  if (para.length) out.push(`<p>${para.join(' ')}</p>`);
  return out.join('\n');
}

function parseAttributes(attrString) {
  const attrs = {}; const re = /([a-zA-Z][\w:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/g; let m;
  while ((m = re.exec(attrString || '')) !== null) attrs[m[1]] = m[2] ?? m[3] ?? m[4] ?? '';
  return attrs;
}
function extractTags(source, tagName) {
  const results = [];
  const selfRe = new RegExp(`<${tagName}(\\s[^>]*?)?\\s*/>`,'gi'); let m;
  while ((m = selfRe.exec(source)) !== null) results.push({ full:m[0], attrs:parseAttributes(m[1]), content:'', index:m.index });
  const openRe = new RegExp(`<${tagName}(\\s[^>]*?)?>([\\s\\S]*?)<\\/${tagName}>`,'gi');
  while ((m = openRe.exec(source)) !== null) results.push({ full:m[0], attrs:parseAttributes(m[1]), content:m[2]||'', index:m.index });
  return results.sort((a,b) => a.index - b.index);
}
function replaceAll(source, tagName, replacer) {
  const tags = extractTags(source, tagName); let result = source;
  for (let i = tags.length-1; i >= 0; i--) {
    const t = tags[i]; result = result.slice(0,t.index) + replacer(t.attrs,t.content,t) + result.slice(t.index + t.full.length);
  }
  return result;
}
function renderIcon(name, size=20) { return `<i data-lucide="${name}" style="width:${size}px;height:${size}px"></i>`; }
function renderNavbar(attrs) {
  const brand = attrs.brand || 'Stack';
  const links = (attrs.links||'').split(',').map(l=>l.trim()).filter(Boolean).map(pair => { const [label,href]=pair.split(':'); return {label:(label||'').trim(), href:(href||'#').trim()}; });
  const linkHtml = links.map(l=>`<li><a href="${l.href}">${l.label}</a></li>`).join('');
  return `\n<nav class="stk-navbar">\n  <div class="container stk-navbar-inner">\n    <a href="/" class="stk-brand">${renderIcon('layers',22)} ${brand}</a>\n    <ul class="stk-nav-links">${linkHtml}</ul>\n  </div>\n</nav>`;
}
function renderHero(attrs) {
  const title = attrs.title||'Welcome', subtitle = attrs.subtitle||'';
  const parseBtn = (str) => { if(!str) return null; const [label,href]=str.split(':'); return {label:(label||'').trim(), href:(href||'#').trim()}; };
  const primary = parseBtn(attrs.cta), sec = parseBtn(attrs.secondary);
  return `\n<section class="stk-hero">\n  <div class="container stk-hero-content">\n    <h1>${title}</h1>\n    ${subtitle?`<p>${subtitle}</p>`:''}\n    <div class="stk-hero-actions">\n      ${primary?`<a href="${primary.href}" class="stk-btn stk-btn-primary">${primary.label}</a>`:''}\n      ${sec?`<a href="${sec.href}" class="stk-btn stk-btn-secondary">${sec.label}</a>`:''}\n    </div>\n  </div>\n</section>`;
}
function renderCard(attrs, content) {
  const icon = attrs.icon ? `<div class="stk-card-icon">${renderIcon(attrs.icon,22)}</div>` : '';
  const title = attrs.title ? `<h3>${attrs.title}</h3>` : '';
  return `\n<div class="stk-card">\n  ${icon}\n  ${title}\n  <p>${content.trim()}</p>\n</div>`;
}
function renderGrid(attrs, content) { return `<div class="stk-grid stk-grid-${attrs.cols||'3'}">${content}</div>`; }
function renderSection(attrs, content) {
  const title = attrs.title ? `<div class="section-title"><h2>${attrs.title}</h2>${attrs.subtitle?`<p>${attrs.subtitle}</p>`:''}</div>` : '';
  return `\n<section class="section">\n  <div class="container">\n    ${title}\n    ${content}\n  </div>\n</section>`;
}
function renderCounter(attrs) {
  const start = attrs.start||'0'; const id = 'c_'+Math.random().toString(36).slice(2,8);
  return `\n<div class="stk-counter" id="${id}">\n  <button type="button" data-action="dec" aria-label="Decrease">−</button>\n  <span class="stk-counter-value" data-value>${start}</span>\n  <button type="button" data-action="inc" aria-label="Increase">+</button>\n</div>\n<script>(function(){const root=document.getElementById('${id}');if(!root)return;const valEl=root.querySelector('[data-value]');let n=${parseInt(start,10)||0};root.addEventListener('click',e=>{const btn=e.target.closest('button');if(!btn)return;if(btn.dataset.action==='inc')n++;if(btn.dataset.action==='dec')n--;valEl.textContent=n;});})();</script>`;
}
function renderFooter(attrs, content) { return `\n<footer class="stk-footer">\n  <div class="container">${content.trim()||attrs.text||'Built with Stack'}</div>\n</footer>`; }
function renderMd(attrs, content) { return `<div class="stk-md">${simpleMarkdown(content)}</div>`; }
function renderButton(attrs, content) {
  const variant = attrs.variant||'primary', href = attrs.href, label = content.trim()||attrs.label||'Button', cls = `stk-btn stk-btn-${variant}`;
  if (href) return `<a href="${href}" class="${cls}">${label}</a>`;
  return `<button type="button" class="${cls}">${label}</button>`;
}

async function compile(filePath, options = {}) {
  let source = fs.readFileSync(filePath, 'utf8');
  const pageMatch = source.match(/<page(\s[^>]*)?>/i);
  const pageAttrs = pageMatch ? parseAttributes(pageMatch[1]||'') : {};
  const title = pageAttrs.title || 'Stack Site';
  const themeName = options.theme || pageAttrs.theme || 'midnight';
  source = source.replace(/<page(\s[^>]*)?>/i,'').replace(/<\/page>/i,'');
  source = replaceAll(source,'md',(a,c)=>renderMd(a,c));
  source = replaceAll(source,'card',(a,c)=>renderCard(a,c));
  source = replaceAll(source,'grid',(a,c)=>renderGrid(a,c));
  source = replaceAll(source,'section',(a,c)=>renderSection(a,c));
  source = replaceAll(source,'navbar',(a)=>renderNavbar(a));
  source = replaceAll(source,'hero',(a)=>renderHero(a));
  source = replaceAll(source,'counter',(a)=>renderCounter(a));
  source = replaceAll(source,'footer',(a,c)=>renderFooter(a,c));
  source = replaceAll(source,'button',(a,c)=>renderButton(a,c));
  const themeCSS = getThemeCSS(themeName);
  // Embed all theme vars for client-side switching
  const allThemesJson = JSON.stringify(
    Object.fromEntries(Object.entries(themes).map(([n, t]) => [n, t.vars]))
  );

  const themeSwitcher = options.dev ? `
<div class="stk-theme-bar" id="theme-bar">
${Object.entries(themes).map(([name,t])=>`  <button type="button" class="stk-theme-dot ${name===themeName?'active':''}" data-theme="${name}" style="background:${t.vars['--accent']}" title="${name}" aria-label="${name}"></button>`).join('\n')}
</div>
<script>
(function(){
  var themes = ${allThemesJson};
  var bar = document.getElementById('theme-bar');
  if (!bar) return;

  function applyTheme(name) {
    var vars = themes[name];
    if (!vars) return;
    var root = document.documentElement;
    Object.keys(vars).forEach(function(k){ root.style.setProperty(k, vars[k]); });
    bar.querySelectorAll('[data-theme]').forEach(function(btn){
      btn.classList.toggle('active', btn.getAttribute('data-theme') === name);
    });
    try { localStorage.setItem('stk-theme', name); } catch(e) {}
  }

  bar.addEventListener('click', function(e){
    var btn = e.target.closest('[data-theme]');
    if (!btn) return;
    applyTheme(btn.getAttribute('data-theme'));
  });

  // restore last choice
  try {
    var saved = localStorage.getItem('stk-theme');
    if (saved && themes[saved]) applyTheme(saved);
  } catch(e) {}
})();
</script>` : '';

  const noCacheMeta = options.dev ? `
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />` : '';

  const liveReload = options.dev ? `
<script>
(function(){
  var last = null;
  function check(){
    fetch('/__stk_version?t=' + Date.now(), { cache: 'no-store' })
      .then(function(r){ return r.text(); })
      .then(function(v){
        if (last === null) last = v;
        else if (v !== last) location.reload();
      })
      .catch(function(){});
  }
  setInterval(check, 500);
})();
</script>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="Built with Stack" />${noCacheMeta}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
${themeCSS}
${baseCSS}
  </style>
</head>
<body>
${source}
${themeSwitcher}
  <script src="https://unpkg.com/lucide@latest"></script>
  <script>document.addEventListener('DOMContentLoaded',()=>{if(window.lucide)lucide.createIcons();});</script>${liveReload}
</body>
</html>`;
}
module.exports = { compile };
