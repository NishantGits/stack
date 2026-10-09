# Stack

**Write less. Ship beautiful sites.**

Stack combines HTML, CSS, JavaScript and Markdown into one elegant file.
Six professional themes, Lucide icons, ready components, zero-dependency CLI.

    node bin/stk.js dev examples/landing.stk

## Commands

| Command | Description |
|---------|-------------|
| stk build file | Compile .stk to static HTML |
| stk dev file | Live-reload dev server |
| stk themes | List themes |
| stk init [name] | Scaffold new project |
| stk help | Help |

    node bin/stk.js build site.stk -o public --theme aurora
    node bin/stk.js dev site.stk --port 4000

## Themes

midnight · aurora · paper · cyberpunk · forest · ocean

    <page theme="aurora">

## Deploy to Vercel

    node bin/stk.js build index.stk -o public
    npx vercel --prod

Or on Vercel dashboard:
- Build Command: node bin/stk.js build index.stk -o public
- Output Directory: public

## License

MIT
