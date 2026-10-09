#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const VERSION = '1.2.0';

const c = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  cyan: '\x1b[36m', green: '\x1b[32m', yellow: '\x1b[33m',
  red: '\x1b[31m', magenta: '\x1b[35m', white: '\x1b[37m',
  bgGreen: '\x1b[42m', bgCyan: '\x1b[46m', black: '\x1b[30m',
};
const color = (code, text) => `${code}${text}${c.reset}`;

function parseArgs(argv) {
  const args = { _: [], flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('-')) { args.flags[key] = next; i++; }
      else args.flags[key] = true;
    } else if (a.startsWith('-') && a.length === 2) {
      const key = a.slice(1);
      const next = argv[i + 1];
      if (next && !next.startsWith('-')) { args.flags[key] = next; i++; }
      else args.flags[key] = true;
    } else args._.push(a);
  }
  return args;
}

const { compile } = require('../src/compiler');
const { themes } = require('../src/themes');

function findDefaultFile() {
  for (const f of ['index.stk', 'examples/landing.stk', 'landing.stk', 'src/index.stk']) {
    if (fs.existsSync(path.resolve(f))) return f;
  }
  return null;
}

function timestamp() {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}

async function cmdBuild(file, flags) {
  const abs = path.resolve(file);
  if (!fs.existsSync(abs)) {
    console.error(color(c.red, `  ✕  File not found: ${file}`));
    process.exit(1);
  }
  const start = Date.now();
  process.stdout.write(color(c.dim, '  →  Compiling… '));
  try {
    const html = await compile(abs, { theme: flags.theme || flags.t, minify: !!flags.minify });
    const outDir = path.resolve(flags.out || flags.o || 'dist');
    fs.mkdirSync(outDir, { recursive: true });
    const outName = path.basename(file, path.extname(file)) + '.html';
    const outPath = path.join(outDir, outName);
    fs.writeFileSync(outPath, html, 'utf8');
    const kb = (Buffer.byteLength(html) / 1024).toFixed(1);
    const ms = Date.now() - start;
    console.log(color(c.green, 'done'));
    console.log(`  ${color(c.green, '✓')}  ${color(c.bold, path.relative(process.cwd(), outPath))}  ${color(c.dim, `${kb} KB · ${ms}ms`)}\n`);
  } catch (err) {
    console.log(color(c.red, 'failed'));
    console.error(color(c.red, `  ✕  ${err.message}\n`));
    process.exit(1);
  }
}

async function cmdDev(file, flags) {
  let target = file;
  if (!target) {
    target = findDefaultFile();
    if (!target) {
      console.error(color(c.red, '  ✕  No .stk file found. Try: stk dev site.stk\n'));
      process.exit(1);
    }
  }
  const abs = path.resolve(target);
  if (!fs.existsSync(abs)) {
    console.error(color(c.red, `  ✕  File not found: ${target}\n`));
    process.exit(1);
  }

  const port = parseInt(flags.port || flags.p || '3000', 10);
  let latestHtml = '';

  async function rebuild(isInitial = false) {
    const start = Date.now();
    try {
      latestHtml = await compile(abs, {
        theme: flags.theme || flags.t,
        dev: true,
      });
      const bust = `<!-- stk:${Date.now()} -->`;
      if (!latestHtml.includes('stk:')) {
        latestHtml = latestHtml.replace('</head>', `  ${bust}\n</head>`);
      } else {
        latestHtml = latestHtml.replace(/<!-- stk:\d+ -->/, bust);
      }
      const ms = Date.now() - start;
      if (isInitial) return { ok: true, ms };
      process.stdout.write(
        `\r  ${color(c.green, '✓')}  ${color(c.dim, timestamp())}  rebuilt  ${color(c.dim, `${ms}ms`)}   `
      );
      return { ok: true, ms };
    } catch (err) {
      console.error(`\n  ${color(c.red, '✕')}  ${color(c.red, err.message)}`);
      return { ok: false };
    }
  }

  const result = await rebuild(true);
  if (!result.ok) process.exit(1);

  let lastMtime = fs.statSync(abs).mtimeMs;
  setInterval(async () => {
    try {
      const mtime = fs.statSync(abs).mtimeMs;
      if (mtime !== lastMtime) {
        lastMtime = mtime;
        await rebuild(false);
      }
    } catch (_) {}
  }, 250);

  http.createServer((req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
      'ETag': `"${Date.now()}"`,
    });
    res.end(latestHtml);
  }).listen(port, () => {
    const rel = path.relative(process.cwd(), abs);
    console.log();
    console.log(`  ${color(c.bgCyan + c.black, ' STK ')}  ${color(c.bold, 'dev server')}`);
    console.log();
    console.log(`  ${color(c.green, '➜')}  Local    ${color(c.cyan + c.bold, `http://localhost:${port}`)}`);
    console.log(`  ${color(c.dim, '➜')}  File     ${color(c.dim, rel)}`);
    console.log(`  ${color(c.dim, '➜')}  Built    ${color(c.dim, `${result.ms}ms`)}`);
    console.log();
    console.log(`  ${color(c.dim, 'watching for changes · ctrl+c to stop')}`);
    console.log();
  });
}

function cmdThemes() {
  console.log();
  console.log(`  ${color(c.bold, 'Themes')}`);
  console.log();
  for (const [name, t] of Object.entries(themes)) {
    console.log(`  ${color(c.cyan, '●')}  ${color(c.bold, name.padEnd(12))} ${color(c.dim, t.description)}`);
  }
  console.log();
  console.log(`  ${color(c.dim, 'Use:')}  <page theme="aurora">  ${color(c.dim, 'or')}  stk build site.stk -t cyberpunk`);
  console.log();
}

function cmdInit(name = 'my-stack-site') {
  const dir = path.resolve(name);
  if (fs.existsSync(dir)) {
    console.error(color(c.red, `  ✕  Already exists: ${name}\n`));
    process.exit(1);
  }
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'index.stk'),
    `<page title="${name}" theme="midnight">\n  <navbar brand="${name}" links="Home:/" />\n  <hero title="Welcome to Stack" subtitle="Write beautiful sites fast." cta="Get Started:#" />\n  <section title="Features">\n    <grid cols="3">\n      <card icon="zap" title="Fast">Single HTML output.</card>\n      <card icon="palette" title="Themes">Six themes built-in.</card>\n      <card icon="code-2" title="Markdown">Write content in Markdown.</card>\n    </grid>\n  </section>\n  <footer>Built with Stack</footer>\n</page>\n`
  );
  console.log();
  console.log(`  ${color(c.green, '✓')}  Created ${color(c.bold, name + '/')}`);
  console.log(`  ${color(c.dim, '→')}  cd ${name} && node path/to/stk.js dev`);
  console.log();
}

function cmdHelp() {
  console.log(`
  ${color(c.bgCyan + c.black, ' STK ')}  ${color(c.dim, 'v' + VERSION)}

  ${color(c.bold, 'Commands')}
    ${color(c.cyan, 'dev')} [file]        Dev server (auto-finds index.stk / examples/landing.stk)
    ${color(c.cyan, 'build')} <file>      Compile to static HTML
    ${color(c.cyan, 'themes')}            List built-in themes
    ${color(c.cyan, 'init')} [name]       Scaffold a new project
    ${color(c.cyan, 'help')}              Show this help

  ${color(c.bold, 'Flags')}
    -p, --port <n>      Port (default 3000)
    -t, --theme <name>  Force theme
    -o, --out <dir>     Output dir for build (default dist)

  ${color(c.bold, 'Examples')}
    stk dev
    stk dev site.stk --port 4000
    stk build site.stk -o public -t aurora
`);
}

const args = parseArgs(process.argv.slice(2));
const command = args._[0] || 'dev';
const rest = args._.slice(1);

(async () => {
  switch (command) {
    case 'build':
      if (!rest[0]) { console.error(color(c.red, '  Usage: stk build <file.stk>\n')); process.exit(1); }
      await cmdBuild(rest[0], args.flags);
      break;
    case 'dev':
      await cmdDev(rest[0], args.flags);
      break;
    case 'themes':
      cmdThemes();
      break;
    case 'init':
      cmdInit(rest[0]);
      break;
    case 'help': case '--help': case '-h':
      cmdHelp();
      break;
    case '--version': case '-v':
      console.log(VERSION);
      break;
    default:
      if (command.endsWith('.stk')) {
        await cmdDev(command, args.flags);
      } else {
        console.error(color(c.red, `  ✕  Unknown: ${command}`));
        cmdHelp();
        process.exit(1);
      }
  }
})();
