const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const yaml = require('js-yaml');

const md = new MarkdownIt();

// Read content files
function readContentFile(filename) {
    const filePath = path.join(__dirname, 'content', filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse frontmatter
    const match = fileContent.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (match) {
        const frontmatter = yaml.load(match[1]);
        const content = match[2].trim();
        return { frontmatter, content: md.render(content) };
    }
    
    return { frontmatter: {}, content: md.render(fileContent) };
}

// Read fellows
function readFellows() {
    const fellowsDir = path.join(__dirname, 'content', 'fellows');
    const fellowFiles = fs.readdirSync(fellowsDir).filter(file => file.endsWith('.md'));
    
    return fellowFiles.map(file => {
        const fellowContent = readContentFile(`fellows/${file}`);
        return {
            ...fellowContent.frontmatter,
            filename: file
        };
    }).sort((a, b) => (a.order || 0) - (b.order || 0));
}

// Read research
function readResearch() {
    const researchDir = path.join(__dirname, 'content', 'research');
    const researchFiles = fs.readdirSync(researchDir).filter(file => file.endsWith('.md'));
    
    const researchMap = {};
    researchFiles.forEach(file => {
        const researchContent = readContentFile(`research/${file}`);
        const id = researchContent.frontmatter.id;
        if (id) {
            researchMap[id] = {
                ...researchContent.frontmatter,
                content: researchContent.content,
                filename: file
            };
        }
    });
    
    return researchMap;
}

// Read projects
function readProjects() {
    const projectsDir = path.join(__dirname, 'content', 'projects');
    const projectFiles = fs.readdirSync(projectsDir).filter(file => file.endsWith('.md'));
    
    return projectFiles.map(file => {
        const projectContent = readContentFile(`projects/${file}`);
        return {
            ...projectContent.frontmatter,
            content: projectContent.content,
            filename: file
        };
    }).sort((a, b) => (a.order || 0) - (b.order || 0));
}

// Load all content
const hero = readContentFile('hero.md');
const vision = readContentFile('vision.md');
const beaconProjects = readContentFile('beacon-projects.md');
const fellowship = readContentFile('fellowship.md');
const fellowshipDescription = readContentFile('fellowship-description.md');
const fellows = readFellows();
const projects = readProjects();
const research = readResearch();

// Icon mapping
const iconSvgs = {
    mediation: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="m22 21-3-3m0 0a5.5 5.5 0 0 0 0-7.8 5.5 5.5 0 0 0-7.8 0 5.5 5.5 0 0 0 0 7.8 5.5 5.5 0 0 0 7.8 0z"/>`,
    layers: `<path d="M12 2L2 7l10 5 10-5-10-5z"/>
             <path d="M2 17l10 5 10-5"/>
             <path d="M2 12l10 5 10-5"/>`,
    settings: `<circle cx="12" cy="12" r="3"/>
               <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>`
};

// Network node SVG
const networkNodeSvg = `<circle cx="12" cy="5" r="2"/>
                        <circle cx="5" cy="19" r="2"/>
                        <circle cx="19" cy="19" r="2"/>
                        <circle cx="12" cy="12" r="3"/>
                        <line x1="12" y1="7" x2="12" y2="9"/>
                        <line x1="10.94" y1="13.06" x2="6.88" y2="17.12"/>
                        <line x1="13.06" y1="13.06" x2="17.12" y2="17.12"/>`;

// Generate beacon projects HTML for homepage
function generateBeaconProjects() {
    const projectsData = beaconProjects.frontmatter.projects || [];
    return projectsData.map(project => `
        <a href="project-${project.link.replace('#', '')}.html" class="beacon-card">
            <div class="beacon-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${iconSvgs[project.icon] || ''}
                </svg>
            </div>
            <h3>${project.title.replace(' ', '<br>')}</h3>
            <p>${project.description}</p>
        </a>
    `).join('');
}

// Generate projects listing for projects page
function generateProjectsListing() {
    return projects.map(project => `
        <a href="project-${project.slug}.html" class="project-card">
            <div class="project-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1">
                    <circle cx="20" cy="12" r="3" fill="currentColor"/>
                    <circle cx="8" cy="28" r="3" fill="currentColor"/>
                    <circle cx="32" cy="28" r="3" fill="currentColor"/>
                    <circle cx="20" cy="20" r="4" fill="none"/>
                    <line x1="20" y1="15" x2="20" y2="16"/>
                    <line x1="17" y1="22" x2="11" y2="26"/>
                    <line x1="23" y1="22" x2="29" y2="26"/>
                </svg>
            </div>
            <h3>${project.title}</h3>
            <p>${project.description}</p>
        </a>
    `).join('');
}

// Generate fellows HTML
function generateFellows() {
    return fellows.map(fellow => `
        <div class="fellow-card">
            <div class="fellow-portrait">
                <div class="portrait-placeholder">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="30" cy="20" r="8"/>
                        <path d="M12 50c0-10 8-18 18-18s18 8 18 18"/>
                    </svg>
                </div>
            </div>
            <h3 class="fellow-name">${fellow.name}</h3>
            <p class="fellow-description">${fellow.description}</p>
        </div>
    `).join('');
}

// Generate HTML
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${hero.frontmatter.title}</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="container">
        <!-- Navigation -->
        <nav class="main-nav">
            <ul>
                <li><a href="index.html" class="active">Home</a></li>
                <li><a href="projects.html">Projects</a></li>
                <li><a href="fellowship.html">Fellowship</a></li>
            </ul>
        </nav>
        <!-- Hero Section -->
        <section class="hero">
            <!-- Decorative network nodes -->
            <div class="hero-decorations top-left">
                <div class="network-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${networkNodeSvg}
                    </svg>
                </div>
            </div>
            <div class="hero-decorations top-right">
                <div class="network-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${networkNodeSvg}
                    </svg>
                </div>
            </div>
            <div class="hero-decorations bottom-right">
                <div class="network-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${networkNodeSvg}
                    </svg>
                </div>
            </div>

            <h1 class="hero-title">${(hero.frontmatter.title || '').replace(/\s&\s/g, '<br>&<br>')}</h1>
            <p class="hero-subtitle">
                ${hero.frontmatter.subtitle}
            </p>
            <a href="${hero.frontmatter.cta_link}" class="btn">${hero.frontmatter.cta_text}</a>
        </section>

        <!-- Vision Section -->
        <section class="section">
            <div class="two-column">
                <div>
                    <h2>${vision.frontmatter.title}</h2>
                    <div class="content">${vision.content}</div>
                </div>
                <div>
                    <div style="text-align: right; margin-top: 2rem;">
                        <svg width="120" height="80" viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="1">
                            <circle cx="20" cy="20" r="3" fill="currentColor"/>
                            <circle cx="60" cy="15" r="3" fill="currentColor"/>
                            <circle cx="100" cy="25" r="3" fill="currentColor"/>
                            <circle cx="30" cy="45" r="3" fill="currentColor"/>
                            <circle cx="80" cy="40" r="3" fill="currentColor"/>
                            <circle cx="50" cy="65" r="3" fill="currentColor"/>
                            <line x1="20" y1="20" x2="60" y2="15"/>
                            <line x1="60" y1="15" x2="100" y2="25"/>
                            <line x1="20" y1="20" x2="30" y2="45"/>
                            <line x1="60" y1="15" x2="80" y2="40"/>
                            <line x1="30" y1="45" x2="50" y2="65"/>
                            <line x1="80" y1="40" x2="50" y2="65"/>
                            <text x="95" y="70" font-size="12" fill="currentColor">field of knowledge</text>
                            <text x="10" y="75" font-size="12" fill="currentColor">?</text>
                            <text x="110" y="50" font-size="12" fill="currentColor">?</text>
                        </svg>
                    </div>
                </div>
            </div>
        </section>

        <!-- Beacon Projects Section -->
        <section class="section">
            <h2 class="section-title">${beaconProjects.frontmatter.title}</h2>
            <div class="beacon-grid">
                ${generateBeaconProjects()}
            </div>
        </section>

        <!-- Fellowship Section -->
        <section class="section">
            <h2 class="section-title">${fellowship.frontmatter.title}</h2>
            <div class="main-content">
                <div class="content">${fellowship.content}</div>
                <div style="margin-top: 2rem;">
                    <a href="${fellowship.frontmatter.cta_link}" class="btn-outline">${fellowship.frontmatter.cta_text}</a>
                </div>
            </div>
        </section>
    </div>
</body>
</html>`;

// Generate fellowship page HTML
const fellowshipHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fellowship Page - AI for Epistemics & Coordination</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="container">
        <!-- Navigation -->
        <nav class="main-nav">
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="projects.html">Projects</a></li>
                <li><a href="fellowship.html" class="active">Fellowship</a></li>
            </ul>
        </nav>
        
        <!-- Header -->
        <header>
            <div class="fellowship-header">
                <h1 class="fellowship-title">FELLOWSHIP PAGE</h1>
                <div class="header-line"></div>
            </div>
        </header>

        <!-- Fellowship Description -->
        <section class="fellowship-description-section">
            <div class="main-content">
                <div class="content">${fellowshipDescription.content}</div>
            </div>
        </section>

        <!-- Fellows Grid -->
        <section class="fellows-section">
            <div class="fellows-grid">
                ${generateFellows()}
            </div>
        </section>
    </div>
</body>
</html>`;

// Generate projects listing page
const projectsListingHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beacon Projects - AI for Epistemics & Coordination</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="container">
        <!-- Navigation -->
        <nav class="main-nav">
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="projects.html" class="active">Projects</a></li>
                <li><a href="fellowship.html">Fellowship</a></li>
            </ul>
        </nav>
        
        <!-- Header -->
        <header>
            <div class="projects-header">
                <h1 class="projects-title">BEACON PROJECTS</h1>
                <div class="header-line"></div>
            </div>
        </header>

        <!-- Projects Grid -->
        <section class="projects-section">
            <div class="projects-grid">
                ${generateProjectsListing()}
            </div>
        </section>
    </div>
</body>
</html>`;

// Generate individual project pages
function generateProjectPage(project) {
    const foundationalCapabilities = project.foundational_capabilities || [];
    const fellowshipResearchIds = project.fellowship_research || [];
    
    const capabilitiesHtml = foundationalCapabilities.map(cap => `
        <div class="capability-card">
            <h3>${cap.title}</h3>
            <p>${cap.description}</p>
        </div>
    `).join('');
    
    const researchHtml = fellowshipResearchIds.map(researchId => {
        const researchItem = research[researchId];
        if (!researchItem) return '';
        
        return `
        <div class="research-accordion-item">
            <div class="research-header" onclick="toggleAccordion('${researchId}')">
                <h4>${researchItem.title}</h4>
                <p class="research-short-description">${researchItem.short_description}</p>
                <div class="accordion-toggle">+</div>
            </div>
            <div class="research-content" id="research-${researchId}">
                <div class="research-detail">
                    ${researchItem.content}
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beacon Project: ${project.title} - AI for Epistemics & Coordination</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="container">
        <!-- Navigation -->
        <nav class="main-nav">
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="projects.html" class="active">Projects</a></li>
                <li><a href="fellowship.html">Fellowship</a></li>
            </ul>
        </nav>
        
        <!-- Project Header -->
        <section class="project-hero">
            <div class="project-border">
                <h1 class="project-title">BEACON PROJECT: ${project.title}</h1>
                <p class="project-description">${project.description}</p>
                <div class="project-diagram">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1">
                        <circle cx="30" cy="18" r="4" fill="currentColor"/>
                        <circle cx="15" cy="42" r="4" fill="currentColor"/>
                        <circle cx="45" cy="42" r="4" fill="currentColor"/>
                        <circle cx="30" cy="30" r="6" fill="none"/>
                        <line x1="30" y1="22" x2="30" y2="24"/>
                        <line x1="25" y1="33" x2="19" y2="39"/>
                        <line x1="35" y1="33" x2="41" y2="39"/>
                    </svg>
                </div>
            </div>
        </section>

        <!-- Foundational Capabilities -->
        <section class="capabilities-section">
            <h2 class="section-title">FOUNDATIONAL CAPABILITIES <span class="capability-count">(${foundationalCapabilities.length})</span></h2>
            <div class="capabilities-grid">
                ${capabilitiesHtml}
            </div>
        </section>

        <!-- Fellowship Research -->
        <section class="research-section">
            <h2 class="section-title">FELLOWSHIP RESEARCH</h2>
            <div class="research-accordion">
                ${researchHtml}
            </div>
        </section>
    </div>
    
    <script>
    function toggleAccordion(researchId) {
        const content = document.getElementById('research-' + researchId);
        const toggle = event.target.closest('.research-header').querySelector('.accordion-toggle');
        
        if (content.style.display === 'block') {
            content.style.display = 'none';
            toggle.textContent = '+';
        } else {
            // Close all other accordions
            const allContent = document.querySelectorAll('.research-content');
            const allToggles = document.querySelectorAll('.accordion-toggle');
            allContent.forEach(c => c.style.display = 'none');
            allToggles.forEach(t => t.textContent = '+');
            
            // Open this one
            content.style.display = 'block';
            toggle.textContent = '−';
        }
    }
    </script>
</body>
</html>`;
}

// Write the generated HTML files
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
fs.writeFileSync(path.join(__dirname, 'fellowship.html'), fellowshipHtml);
fs.writeFileSync(path.join(__dirname, 'projects.html'), projectsListingHtml);

// Generate individual project pages
projects.forEach(project => {
    const projectPageHtml = generateProjectPage(project);
    fs.writeFileSync(path.join(__dirname, `project-${project.slug}.html`), projectPageHtml);
});

console.log('✅ All pages generated successfully from markdown files!');
console.log(`📄 Generated: index.html, fellowship.html, projects.html, and ${projects.length} project pages`);
console.log('📝 Edit content in the content/ folder, then run "npm run build" to regenerate.');