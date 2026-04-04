# Portfolio — Kamesh Srinivasan

Static personal site: **Electrical & Computer Engineering** portfolio (education, experience, projects, coursework, contact). Built as plain HTML/CSS/JS—no build step.

## Features

- **Ink Wash** visual theme: muted palette (`#4A4A4A`, `#CBCBCB`, `#FFFFE3`, `#6D8196`)
- **Dark mode default** (CSS `:root` is the dark palette before JS runs); light mode uses `body.light-theme`. Toggle persists `dark` or `light` in `localStorage` (`kamesh-portfolio-theme`)
- **KS** favicon and nav monogram
- Responsive layout, mobile menu, scroll progress, section reveal animations
- Contact form UI (hook your own backend or service as needed)

## Project layout

| Path | Role |
|------|------|
| `index.html` | Main page and content |
| `css/style.css` | Theme and layout |
| `js/script.js` | Interactions, theme, animations |
| `assets/` | Images, favicon, project media |
| `css/style-backup.css`, `css/style-v2-backup.css` | Older stylesheet snapshots (reference only) |

## Run locally

From this directory, serve files over HTTP (avoids some browser restrictions on `file://`):

```bash
# Python 3
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

Or open `index.html` directly in a browser for a quick preview.

## Deploy

Upload the folder to any static host (GitHub Pages, Netlify, Cloudflare Pages, etc.). Ensure asset paths stay relative to `index.html`.

## License

MIT — see [LICENSE](LICENSE).
