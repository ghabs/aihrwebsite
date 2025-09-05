# AI for Epistemics & Coordination Fellowship Website

A minimalist static website for the fellowship, built with markdown content that renders to HTML.

## Quick Start

1. Edit content in the `content/` folder
2. Run `npm run build` to regenerate the site
3. Open `index.html` in your browser

## Editing Content

All content is stored in markdown files in the `content/` folder:

### `content/hero.md`
The main hero section with title, subtitle, and call-to-action button.

```yaml
---
title: "AI FOR EPISTEMICS & COORDINATION"
subtitle: "Your mission statement here..."
cta_text: "READ THE THEORY" 
cta_link: "#theory"
---
```

### `content/vision.md`
The vision section content.

```yaml
---
title: "OUR VISION"
---

Your vision content here in markdown...
```

### `content/beacon-projects.md`
The beacon projects grid with project cards.

```yaml
---
title: "BEACON PROJECTS"
projects:
  - title: "PROJECT NAME"
    description: "Project description"
    link: "#project-link"
    icon: "mediation" # Options: mediation, layers, settings
---
```

### `content/fellowship.md`
The fellowship section.

```yaml
---
title: "FELLOWSHIP"
cta_text: "MEET THE FELLOWS"
cta_link: "fellowship.html"
---

Your fellowship description in markdown...
```

## Development

- `npm run build` - Generate the site from markdown
- `npm run dev` - Build and open in browser

## File Structure

```
├── index.html          # Generated homepage (don't edit directly)
├── assets/css/style.css # Styling
├── content/            # Markdown content files (edit these!)
├── build.js           # Site generator
└── package.json       # Dependencies
```

## Adding New Sections

To add new sections, edit `build.js` and create corresponding markdown files in `content/`.