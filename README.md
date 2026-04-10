# AI for Human Reasoning — Website

Static website for the AI for Epistemics & Coordination Fellowship. Content is written in Markdown files and compiled into HTML by a Node.js build script. The output is deployed to Netlify.

---

## Prerequisites

- **Node.js** v18 or later — download from [nodejs.org](https://nodejs.org)
- **npm** (comes with Node.js)
- **Netlify CLI** (only needed for deployment) — install once: `npm install -g netlify-cli`

Verify you have Node installed:
```bash
node --version   # should print v18.x.x or higher
npm --version
```

---

## Setup

Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd aihr_website
npm install
```

---

## Project structure

```
aihr_website/
├── content/                  # All editable content lives here
│   ├── hero.md               # (unused in current build)
│   ├── vision.md             # Homepage vision section
│   ├── fellowship.md         # Fellowship intro text on homepage
│   ├── fellowship-description.md  # Longer text on the /fellowship page
│   ├── beacon-projects.md    # Three beacon project cards on homepage
│   ├── theory.md             # Theory page intro
│   ├── privacy.md            # Privacy policy page
│   ├── fellows/              # One .md file per fellow
│   ├── advisors/             # One .md file per advisor/staff
│   ├── projects/
│   │   └── index.md          # List of all fellow presentations
│   └── research/             # Research items linked from project pages
├── assets/
│   ├── css/style.css         # All site styles
│   └── images/
│       ├── fellows/          # Fellow portrait photos
│       └── advisors/         # Advisor portrait photos
├── build.js                  # Build script — reads content/, writes dist/
├── dist/                     # Generated output (don't edit directly)
├── package.json
└── README.md
```

> **Never edit files inside `dist/` directly.** They are overwritten every time you run the build. Edit files in `content/` instead, then rebuild.

---

## Building the site

```bash
npm run build
```

This reads all `content/` files and generates the HTML pages into `dist/`. You'll see output like:

```
✅ All pages generated successfully from markdown files!
📄 Generated: index.html, fellowship.html, projects.html (N presentations), theory.html, privacy.html
📁 Output directory: /path/to/aihr_website/dist
```

### Local preview

```bash
npm run dev
```

This runs the build in watch mode and serves the site at `http://localhost:3000`. The site rebuilds automatically when you save a content or CSS file.

---

## Editing content

All content files use Markdown with a YAML frontmatter block at the top (between the `---` lines). The frontmatter holds structured data; the markdown body below it becomes the main content.

### Vision section (`content/vision.md`)

```yaml
---
title: "OUR VISION"
---

Your vision text here in **markdown**.
```

### Fellowship intro (`content/fellowship.md`)

Short intro shown on the homepage above the people grid.

```yaml
---
title: "FELLOWSHIP"
---

Markdown body text...
```

### Fellowship page description (`content/fellowship-description.md`)

Longer text shown at the top of the `/fellowship` page.

### Beacon projects (`content/beacon-projects.md`)

Three cards shown on the homepage. Each card links to a project detail page.

```yaml
---
title: "BEACON PROJECTS"
projects:
  - title: "AI MEDIATION"
    description: "Short description of the project."
    link: "ai-mediation"        # becomes project-ai-mediation.html
    icon: "mediation"           # options: mediation | layers | settings
  - title: "COLLECTIVE INTELLIGENCE"
    description: "..."
    link: "collective-intelligence"
    icon: "layers"
---
```

---

## Managing fellows

Each fellow has their own Markdown file in `content/fellows/`. The filename doesn't matter for display, but use `firstname-lastname.md` for consistency.

### Fellow file format

```yaml
---
name: "Ada Lovelace"
description: "One-line bio shown on the card and in the modal."
order: 5          # controls sort order in the grid (lower = earlier)
---

# Ada Lovelace

Ada Lovelace is a mathematician and writer...

## Research Focus

Description of their research...

## Projects

- [Project Name](https://example.com)

## Links

- [Personal website](https://example.com)
- [LinkedIn](https://linkedin.com/in/...)
```

**Notes:**
- The `order` field determines position in the grid. Fellows without an `order` default to 0.
- The first paragraph after the `# Name` heading is hidden in the modal (it duplicates the `description` field). Put the main bio content under `## Research Focus` or other headings.
- All markdown under the headings renders in the fellow detail modal.

### Adding a fellow photo

1. Save the photo as `assets/images/fellows/firstname-lastname.jpg` (or `.png`, `.jpeg`, `.webp`)
2. The filename must match the fellow's `name` field, lowercased, with spaces replaced by hyphens and special characters removed
   - "Ada Lovelace" → `ada-lovelace.jpg`
   - "María García" → `maria-garcia.jpg`
3. Run `npm run build` — the photo will appear automatically

If no photo file is found, a placeholder silhouette icon is shown instead.

---

## Managing advisors / staff

Same format as fellows, stored in `content/advisors/`. The `role` field sets the label shown beneath their name.

```yaml
---
name: "Jane Smith"
description: "One-line description (optional)"
role: "Program Director"    # displayed as the role label
order: 1
---
```

Advisor photos go in `assets/images/advisors/` following the same naming convention as fellows (handles umlauts: ü→u, ö→o, ä→a, ß→ss).

---

## Managing presentations

All presentations are listed in `content/projects/index.md`. Each entry in the `presentations` list becomes one row on the Projects page and in the homepage Projects tab.

```yaml
---
title: "Fellow Presentations"
presentations:
  - title: "My Presentation Title"
    fellows: ["Alice Smith", "Bob Jones"]
    youtube_url: "https://www.youtube.com/embed/VIDEO_ID"
    links:
      - url: "https://docs.google.com/..."
        text: "Slides"
      - url: "https://github.com/..."
        text: "GitHub Repo"
```

**Field reference:**

| Field | Required | Description |
|-------|----------|-------------|
| `title` | yes | Presentation title |
| `fellows` | yes | List of presenter names (strings) |
| `youtube_url` | no | Use the **embed** URL: `https://www.youtube.com/embed/VIDEO_ID` (not the watch URL) |
| `links` | no | List of `{url, text}` pairs — shown as buttons below the video |

**Two display modes:**
- If `youtube_url` is set: expandable row with embedded video + links
- If `youtube_url` is absent but `links` has entries: the row is a direct link (clicking the row opens the first link in a new tab)

**Ordering:** presentations appear in the order listed in the file. Move entries up/down to reorder.

---

## Deploying to Netlify

The site is manually deployed. There is no automatic CI/CD — you must run these commands yourself after making changes.

### First-time setup

```bash
npm install -g netlify-cli
netlify login          # opens browser to authenticate
netlify link           # connects this folder to the existing Netlify site
```

### Deploy workflow

1. Make your changes in `content/`
2. Build:
   ```bash
   npm run build
   ```
3. Preview deploy (draft URL, not public):
   ```bash
   netlify deploy --dir=dist
   ```
4. Check the preview URL Netlify prints. If everything looks good:
   ```bash
   netlify deploy --prod --dir=dist
   ```

That's it — the live site is updated immediately.

---

## Common tasks

### Add a new fellow
1. Create `content/fellows/firstname-lastname.md` using the template above
2. Add their photo to `assets/images/fellows/` (optional)
3. Run `npm run build` to verify, then deploy

### Add a new presentation
1. Open `content/projects/index.md`
2. Add a new entry to the `presentations` list
3. Run `npm run build` to verify, then deploy

### Update existing text
1. Open the relevant file in `content/`
2. Edit the markdown body or frontmatter values
3. Run `npm run build`, verify, deploy

### Change the order of fellows/advisors
Edit the `order` field in each person's `.md` file. Lower numbers appear first.

### Update styles
Edit `assets/css/style.css` directly. Run `npm run build` (the build copies the CSS into `dist/`).

---

## Pages generated

| Page | Source | URL |
|------|--------|-----|
| Homepage | `content/vision.md`, `content/fellowship.md`, `content/fellows/`, `content/advisors/`, `content/projects/index.md` | `/` |
| Fellowship | `content/fellowship-description.md`, `content/fellows/`, `content/advisors/` | `/fellowship.html` |
| Presentations | `content/projects/index.md` | `/projects.html` |
| Theory | `content/theory.md` | `/theory.html` |
| Privacy Policy | `content/privacy.md` | `/privacy.html` |
