<p align="center">
  <img src="assets/logo.svg" width="96" height="96" alt="Stack logo" />
</p>

<h1 align="center">Stack</h1>

<p align="center">
  <strong>Write less. Ship beautiful sites.</strong>
</p>

<p align="center">
  A small language that combines <b>HTML</b>, <b>CSS</b>, <b>JavaScript</b>, and <b>Markdown</b><br/>
  into one elegant file — with themes, components, and icons built in.
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> ·
  <a href="#cli">CLI</a> ·
  <a href="#language">Language</a> ·
  <a href="#themes">Themes</a> ·
  <a href="#deploy">Deploy</a>
</p>

---

## Why Stack?

| | |
|---|---|
| **One file** | Mix structure, content, and interactivity without a framework |
| **Zero deps** | Pure Node.js CLI — no npm install required to run |
| **Themes** | Six polished themes, switchable live in the browser |
| **Components** | Navbar, hero, cards, grids, counters, buttons, Markdown |
| **Icons** | Lucide icons via CDN — just write `icon="zap"` |
| **Static output** | Compiles to a single HTML file ready for any host |

---

## Quick Start

```bash
# clone
git clone https://github.com/NishantGits/stack.git
cd stack

# run the landing page
node bin/stk.js dev

# or build static HTML
node bin/stk.js build examples/landing.stk -o dist
```

Open **http://localhost:3000** — edit `examples/landing.stk` and the page live-reloads.

### Scaffold a new site

```bash
node bin/stk.js init my-site
cd my-site
node path/to/stack/bin/stk.js dev
```

---

## CLI

```text
stk dev [file]          Dev server with live reload (defaults to index.stk / examples/landing.stk)
stk build <file>        Compile .stk → static HTML
stk themes              List built-in themes
stk init [name]         Scaffold a new project
stk help                Show help
```

**Flags**

| Flag | Description |
|------|-------------|
| `-p`, `--port <n>` | Port for dev server (default `3000`) |
| `-t`, `--theme <name>` | Force a theme |
| `-o`, `--out <dir>` | Output directory for build (default `dist`) |

**Examples**

```bash
node bin/stk.js dev
node bin/stk.js dev site.stk --port 4000
node bin/stk.js build site.stk -o public -t aurora
node bin/stk.js themes
```

---

## Language

A Stack file looks like this:

```html
<page title="My Site" theme="midnight">

  <navbar brand="MyApp" links="Home:/, Docs:/docs, GitHub:https://github.com" />

  <hero
    title="Hello world"
    subtitle="Built with Stack in one file."
    cta="Get Started:/docs"
    secondary="GitHub:https://github.com"
  />

  <section title="Features" subtitle="Everything you need.">
    <grid cols="3">
      <card icon="zap" title="Fast">Compiles to a single HTML file.</card>
      <card icon="palette" title="Themes">Six professional themes.</card>
      <card icon="code-2" title="Markdown">Write content in Markdown.</card>
    </grid>
  </section>

  <counter start="0" />

  <md>
    ## Docs
    You can write **Markdown** anywhere inside an md block.
  </md>

  <footer>Built with Stack</footer>
</page>
```

### Tags

| Tag | Purpose | Key attributes |
|-----|---------|----------------|
| `<page>` | Root element | `title`, `theme` |
| `<navbar>` | Sticky navigation | `brand`, `links="Label:/path, …"` |
| `<hero>` | Hero section | `title`, `subtitle`, `cta`, `secondary` |
| `<section>` | Content section | `title`, `subtitle` |
| `<grid>` | Responsive grid | `cols="2\|3\|4"` |
| `<card>` | Feature card | `icon` (Lucide name), `title` |
| `<button>` | Themed button | `variant="primary\|secondary"`, `href` |
| `<counter>` | Interactive counter | `start` |
| `<md>` | Markdown block | — |
| `<footer>` | Footer | — |

### Icons

Any [Lucide](https://lucide.dev) icon name works:

```html
<card icon="rocket" title="Launch">Ship faster.</card>
```

Icons load from the official CDN and render client-side.

---

## Themes

| Name | Description |
|------|-------------|
| `midnight` | Deep dark + electric indigo *(default)* |
| `aurora` | Soft dark, teal & violet glow |
| `paper` | Warm light theme |
| `cyberpunk` | Neon pink on pure black |
| `forest` | Earthy greens |
| `ocean` | Deep blue + sky accents |

```html
<page theme="aurora">
```

```bash
node bin/stk.js build site.stk --theme cyberpunk
```

In **dev mode**, use the color dots in the bottom-right corner to switch themes live. Your choice is saved in `localStorage`.

---

## Deploy

Stack outputs plain static HTML — deploy anywhere.

### Vercel

```bash
node bin/stk.js build index.stk -o public
npx vercel --prod
```

Or connect a GitHub repo and set:

| Setting | Value |
|---------|--------|
| **Build Command** | `node bin/stk.js build index.stk -o public` |
| **Output Directory** | `public` |

### Netlify / Cloudflare Pages / GitHub Pages

Build into a folder and point the host at it:

```bash
node bin/stk.js build index.stk -o dist
```

---

## Project structure

```text
stack/
├── bin/stk.js           # CLI
├── src/
│   ├── compiler.js      # .stk → HTML
│   ├── themes.js        # 6 built-in themes
│   └── styles.js        # Professional CSS
├── examples/
│   └── landing.stk      # Demo landing page
├── assets/
│   └── logo.svg
├── package.json
└── README.md
```

---

## Requirements

- **Node.js 18+**
- No npm dependencies required to run

---

## License

[MIT](LICENSE) · Built with Stack
