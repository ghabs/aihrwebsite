const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const yaml = require('js-yaml');

const md = new MarkdownIt({
    html: true // Allow HTML tags in markdown
});

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
            filename: file,
            type: 'fellow'
        };
    }).sort((a, b) => (a.order || 0) - (b.order || 0));
}

// Read advisors
function readAdvisors() {
    const advisorsDir = path.join(__dirname, 'content', 'advisors');

    // Check if advisors directory exists
    if (!fs.existsSync(advisorsDir)) {
        return [];
    }

    const advisorFiles = fs.readdirSync(advisorsDir).filter(file => file.endsWith('.md'));

    return advisorFiles.map(file => {
        const advisorContent = readContentFile(`advisors/${file}`);
        return {
            ...advisorContent.frontmatter,
            filename: file,
            type: 'advisor'
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

// Read theory sections
function readTheorySections() {
    const theoryDir = path.join(__dirname, 'content', 'theory');

    // Check if theory directory exists
    if (!fs.existsSync(theoryDir)) {
        return [];
    }

    const theoryFiles = fs.readdirSync(theoryDir).filter(file => file.endsWith('.md'));

    return theoryFiles.map(file => {
        const theoryContent = readContentFile(`theory/${file}`);
        return {
            ...theoryContent.frontmatter,
            content: theoryContent.content,
            filename: file
        };
    }).sort((a, b) => (a.order || 0) - (b.order || 0));
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
const theory = readContentFile('theory.md');
const fellows = readFellows();
const advisors = readAdvisors();
const projects = readProjects();
const research = readResearch();
const theorySections = readTheorySections();

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

// Generate projects HTML
function generateProjects() {
    return projects.map((project, index) => `
        <div class="project-card" onclick="openProjectModal(${index})" data-project-index="${index}">
            <div class="project-icon">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="30" cy="18" r="4" fill="currentColor"/>
                    <circle cx="15" cy="42" r="4" fill="currentColor"/>
                    <circle cx="45" cy="42" r="4" fill="currentColor"/>
                    <circle cx="30" cy="30" r="6" fill="none"/>
                    <line x1="30" y1="22" x2="30" y2="24"/>
                    <line x1="25" y1="33" x2="19" y2="39"/>
                    <line x1="35" y1="33" x2="41" y2="39"/>
                </svg>
            </div>
            <h3 class="project-name">${project.title}</h3>
            <p class="project-description">${project.description}</p>
        </div>
    `).join('');
}

// Helper function to check if fellow profile image exists
function getFellowImagePath(fellowName) {
    const imageName = fellowName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

    const possibleExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const fellowsImagesPath = path.join(__dirname, 'assets', 'images', 'fellows');

    for (const ext of possibleExtensions) {
        const imagePath = path.join(fellowsImagesPath, `${imageName}.${ext}`);
        if (fs.existsSync(imagePath)) {
            return `assets/images/fellows/${imageName}.${ext}`;
        }
    }
    return null;
}

// Helper function to check if advisor profile image exists
function getAdvisorImagePath(advisorName) {
    const imageName = advisorName.toLowerCase()
        .replace(/ü/g, 'u') // Replace umlaut u
        .replace(/ö/g, 'o') // Replace umlaut o
        .replace(/ä/g, 'a') // Replace umlaut a
        .replace(/ß/g, 'ss') // Replace sharp s
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

    const possibleExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const advisorsImagesPath = path.join(__dirname, 'assets', 'images', 'advisors');

    for (const ext of possibleExtensions) {
        const imagePath = path.join(advisorsImagesPath, `${imageName}.${ext}`);
        if (fs.existsSync(imagePath)) {
            return `assets/images/advisors/${imageName}.${ext}`;
        }
    }
    return null;
}

// Generate fellows and advisors HTML
function generateFellows() {
    // Generate fellows
    const fellowsHtml = fellows.map((fellow, index) => {
        // Read the full fellow content for the modal
        const fellowContent = readContentFile(`fellows/${fellow.filename}`);

        // Check for profile image
        const imagePath = getFellowImagePath(fellow.name);

        const portraitHtml = imagePath ?
            `<img src="${imagePath}" alt="${fellow.name}" class="fellow-image">` :
            `<div class="portrait-placeholder">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="30" cy="20" r="8"/>
                    <path d="M12 50c0-10 8-18 18-18s18 8 18 18"/>
                </svg>
            </div>`;

        return `
        <div class="fellow-card people-item fellow-type" data-fellow-index="${index}" data-type="fellow">
            <div class="fellow-portrait">
                ${portraitHtml}
            </div>
            <h3 class="fellow-name">${fellow.name}</h3>
            <p class="fellow-description">Fellow</p>
        </div>
    `;
    }).join('');

    // Generate advisors
    const advisorsHtml = advisors.map((advisor) => {
        const roleLabel = advisor.role ? advisor.role.toUpperCase() : 'ADVISOR';

        // Check for advisor profile image
        const imagePath = getAdvisorImagePath(advisor.name);
        const portraitContent = imagePath ?
            `<img src="${imagePath}" alt="${advisor.name}" class="fellow-image">` :
            `<div class="portrait-placeholder advisor-placeholder">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="30" cy="20" r="8"/>
                    <path d="M12 50c0-10 8-18 18-18s18 8 18 18"/>
                </svg>
            </div>`;

        return `
        <div class="advisor-card people-item advisor-type" data-type="advisor">
            <div class="fellow-portrait">
                ${portraitContent}
            </div>
            <h3 class="fellow-name">${advisor.name}</h3>
            ${advisor.description ? `<p class="fellow-description">${advisor.description}</p>` : ''}
            <p class="advisor-label">${roleLabel}</p>
        </div>
    `;
    }).join('');

    return fellowsHtml + advisorsHtml;
}

// Generate HTML (Single Page Version)
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${hero.frontmatter.title}</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        /* Lightbox Styles */
        .lightbox {
            display: none;
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            cursor: pointer;
        }

        .lightbox-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        }

        .lightbox-close {
            position: absolute;
            top: 20px;
            right: 35px;
            color: #fff;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
            user-select: none;
        }

        .lightbox-close:hover {
            opacity: 0.7;
        }

        .clickable-image {
            cursor: pointer;
            transition: opacity 0.3s ease;
        }

        .clickable-image:hover {
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Navigation -->
        <nav class="main-nav">
            <ul>
                <li><a href="#hero" class="active">AI for Human Reasoning</a></li>
                <li><a href="#fellowship">Fellowship</a></li>
            </ul>
        </nav>
        <!-- Hero Section -->

        <!-- Vision Section -->
        <section class="section">
            <div class="main-content">
                <div class="content">${vision.content}</div>
            </div>
        </section>

        <!-- Fellowship Section -->
        <section class="section" id="fellowship">
            <h2 class="section-title">${fellowship.frontmatter.title}</h2>
            <div class="main-content">
                <div class="content">${fellowship.content}</div>
            </div>

            <!-- Mode Toggle Controls -->
            <div class="section-controls" style="display: none;">
                <!-- Mode Toggle Switch -->
                <div class="mode-toggle">
                    <div class="toggle-switch">
                        <input type="radio" id="people-mode" name="mode" value="people" checked>
                        <label for="people-mode">People</label>
                        <input type="radio" id="projects-mode" name="mode" value="projects">
                        <label for="projects-mode">Projects</label>
                        <div class="toggle-slider"></div>
                    </div>
                </div>
            </div>

            <!-- Dynamic Header -->
            <h3 class="dynamic-header" id="dynamicHeader">PEOPLE</h3>

            <!-- People Grid (Fellows and Advisors) -->
            <div class="people-grid" id="peopleGrid">
                ${generateFellows()}
            </div>

            <!-- Projects Grid (hidden by default) -->
            <div class="projects-grid" id="projectsGrid" style="display: none;">
                ${generateProjects()}
            </div>
        </section>

        <!-- Mailing List Section -->
        <section class="section mailing-list-section">
            <div class="main-content">
                <h2 class="section-title">STAY UPDATED</h2>
                <div class="mailing-list-content">
                    <p>Subscribe to our mailing list to receive updates on fellowship activities, research progress, and new opportunities in AI for epistemics and coordination.</p>
                    <form class="mailing-list-form" action="https://flf.us16.list-manage.com/subscribe/post?u=5e3896f1a7125d63189824900&amp;id=a8ff7fc644&amp;f_id=00debce0f0" method="post" target="_blank">
                        <div class="form-group">
                            <input type="email" name="EMAIL" placeholder="Enter your email address" required class="email-input">
                            <button type="submit" name="subscribe" class="btn subscribe-btn">SUBSCRIBE</button>
                        </div>
                        <!-- Mailchimp bot prevention -->
                        <div style="position: absolute; left: -5000px;" aria-hidden="true">
                            <input type="text" name="b_5e3896f1a7125d63189824900_a8ff7fc644" tabindex="-1" value="">
                        </div>
                    </form>
                </div>
            </div>
        </section>

        <!-- Fellow Modal -->
        <div id="fellowModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modalFellowName"></h2>
                    <span class="modal-close" onclick="closeFellowModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="modal-fellow-image-container">
                        <img id="modalFellowImage" src="" alt="" class="modal-fellow-image">
                    </div>
                    <p id="modalFellowDescription"></p>
                    <div id="modalFellowContent"></div>
                </div>
                <div class="modal-footer">
                    <button onclick="previousFellow()" id="prevBtn">← Previous Fellow</button>
                    <button onclick="nextFellow()" id="nextBtn">Next Fellow →</button>
                </div>
            </div>
        </div>

        <!-- Project Modal -->
        <div id="projectModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modalProjectName"></h2>
                    <span class="modal-close" onclick="closeProjectModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <p id="modalProjectDescription"></p>
                    <div id="modalProjectContent"></div>
                    <div id="modalProjectCapabilities"></div>
                </div>
                <div class="modal-footer">
                    <button onclick="previousProject()" id="prevProjectBtn">← Previous Project</button>
                    <button onclick="nextProject()" id="nextProjectBtn">Next Project →</button>
                </div>
            </div>
        </div>

        <!-- Lightbox Modal -->
        <div id="lightbox" class="lightbox" onclick="closeLightbox()">
            <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
            <img class="lightbox-content" id="lightbox-image" src="" alt="">
        </div>
    </div>

    <script>
        // Fellow data for modal
        const fellowsData = ${JSON.stringify(fellows.map(fellow => {
            const fellowContent = readContentFile(`fellows/${fellow.filename}`);
            return {
                name: fellow.name,
                description: fellow.description,
                content: fellowContent.content,
                imagePath: getFellowImagePath(fellow.name)
            };
        }))};

        let currentFellowIndex = 0;

        function openFellowModal(index) {
            currentFellowIndex = index;
            const fellow = fellowsData[index];

            document.getElementById('modalFellowName').textContent = fellow.name;
            document.getElementById('modalFellowDescription').textContent = fellow.description;
            document.getElementById('modalFellowContent').innerHTML = fellow.content;

            // Handle fellow image
            const modalImage = document.getElementById('modalFellowImage');
            const imageContainer = document.querySelector('.modal-fellow-image-container');
            if (fellow.imagePath) {
                modalImage.src = fellow.imagePath;
                modalImage.alt = fellow.name;
                imageContainer.style.display = 'block';
            } else {
                imageContainer.style.display = 'none';
            }

            document.getElementById('fellowModal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeFellowModal() {
            document.getElementById('fellowModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function nextFellow() {
            const nextIndex = (currentFellowIndex + 1) % fellowsData.length;
            openFellowModal(nextIndex);
        }

        function previousFellow() {
            const prevIndex = currentFellowIndex === 0 ? fellowsData.length - 1 : currentFellowIndex - 1;
            openFellowModal(prevIndex);
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const fellowModal = document.getElementById('fellowModal');
            const projectModal = document.getElementById('projectModal');
            if (event.target === fellowModal) {
                closeFellowModal();
            } else if (event.target === projectModal) {
                closeProjectModal();
            }
        }

        // Close modal with Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeFellowModal();
                closeProjectModal();
                closeLightbox();
            }
        });

        // Lightbox functionality
        function openLightbox(imageSrc, imageAlt) {
            const lightbox = document.getElementById('lightbox');
            const lightboxImage = document.getElementById('lightbox-image');

            lightboxImage.src = imageSrc;
            lightboxImage.alt = imageAlt || '';
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            const lightbox = document.getElementById('lightbox');
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Make all images clickable after page loads
        document.addEventListener('DOMContentLoaded', function() {
            const images = document.querySelectorAll('img');
            images.forEach(function(img) {
                // Skip fellow portraits and other non-content images
                if (!img.closest('.fellow-portrait') && !img.closest('.modal') && !img.closest('.lightbox')) {
                    img.classList.add('clickable-image');
                    img.addEventListener('click', function() {
                        openLightbox(img.src, img.alt);
                    });
                }
            });
        });

        // Read More / Collapsible Content functionality
        function toggleReadMore() {
            const collapsibleContent = document.getElementById('collapsibleContent');
            const readMoreBtn = document.getElementById('readMoreBtn');

            if (collapsibleContent.classList.contains('expanded')) {
                collapsibleContent.classList.remove('expanded');
                readMoreBtn.textContent = 'Read More';
            } else {
                collapsibleContent.classList.add('expanded');
                readMoreBtn.textContent = 'Read Less';
            }
        }

        // Project data for modal (placeholder - will be populated when projects are added)
        const projectsData = ${JSON.stringify(projects.map(project => {
            const projectContent = readContentFile(`projects/${project.filename}`);
            return {
                title: project.title,
                description: project.description,
                content: projectContent.content,
                relatedFellows: project.related_fellows || []
            };
        }))};

        let currentProjectIndex = 0;

        // Project modal functions
        function openProjectModal(index) {
            currentProjectIndex = index;
            const project = projectsData[index];

            document.getElementById('modalProjectName').textContent = project.title;
            document.getElementById('modalProjectDescription').textContent = project.description;
            document.getElementById('modalProjectContent').innerHTML = project.content;

            // Generate capabilities HTML
            const capabilitiesHtml = project.foundational_capabilities ?
                project.foundational_capabilities.map(cap =>
                    '<div class="capability-item"><h4>' + cap.title + '</h4><p>' + cap.description + '</p></div>'
                ).join('') : '';

            if (capabilitiesHtml) {
                document.getElementById('modalProjectCapabilities').innerHTML =
                    '<h3>Foundational Capabilities</h3>' + capabilitiesHtml;
            } else {
                document.getElementById('modalProjectCapabilities').innerHTML = '';
            }

            document.getElementById('projectModal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeProjectModal() {
            document.getElementById('projectModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function nextProject() {
            const nextIndex = (currentProjectIndex + 1) % projectsData.length;
            openProjectModal(nextIndex);
        }

        function previousProject() {
            const prevIndex = currentProjectIndex === 0 ? projectsData.length - 1 : currentProjectIndex - 1;
            openProjectModal(prevIndex);
        }

        // Mode switching functionality
        function initializeModeSwitch() {
            const peopleMode = document.getElementById('people-mode');
            const projectsMode = document.getElementById('projects-mode');
            const peopleGrid = document.getElementById('peopleGrid');
            const projectsGrid = document.getElementById('projectsGrid');
            const dynamicHeader = document.getElementById('dynamicHeader');

            function switchMode(mode) {
                if (mode === 'people') {
                    peopleGrid.style.display = 'grid';
                    projectsGrid.style.display = 'none';
                    dynamicHeader.textContent = 'PEOPLE';
                } else if (mode === 'projects') {
                    peopleGrid.style.display = 'none';
                    projectsGrid.style.display = 'grid';
                    dynamicHeader.textContent = 'PROJECTS';
                }
            }

            // Add event listeners for mode toggle
            peopleMode.addEventListener('change', function() {
                if (this.checked) {
                    switchMode('people');
                }
            });

            projectsMode.addEventListener('change', function() {
                if (this.checked) {
                    switchMode('projects');
                }
            });

            // Initialize with people mode
            switchMode('people');
        }

        // Initialize the dual-mode interface when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            initializeModeSwitch();
        });
    </script>
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
                <li><a href="theory.html">Theory</a></li>
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
                <li><a href="theory.html">Theory</a></li>
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
                <li><a href="theory.html">Theory</a></li>
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

// Theory page diagrams
const theoryDiagrams = {
    'improved-coordination': `
        <svg width="300" height="150" viewBox="0 0 300 150" fill="none" stroke="currentColor" stroke-width="1">
            <!-- Left cluster -->
            <circle cx="40" cy="40" r="3" fill="currentColor"/>
            <circle cx="25" cy="55" r="3" fill="currentColor"/>
            <circle cx="55" cy="55" r="3" fill="currentColor"/>
            <circle cx="40" cy="70" r="3" fill="currentColor"/>
            <circle cx="20" cy="75" r="3" fill="currentColor"/>
            <circle cx="60" cy="75" r="3" fill="currentColor"/>
            
            <!-- Left cluster connections -->
            <line x1="40" y1="40" x2="25" y2="55"/>
            <line x1="40" y1="40" x2="55" y2="55"/>
            <line x1="25" y1="55" x2="40" y2="70"/>
            <line x1="55" y1="55" x2="40" y2="70"/>
            <line x1="40" y1="70" x2="20" y2="75"/>
            <line x1="40" y1="70" x2="60" y2="75"/>
            <line x1="25" y1="55" x2="20" y2="75"/>
            <line x1="55" y1="55" x2="60" y2="75"/>
            
            <!-- Bridge connections -->
            <line x1="60" y1="75" x2="120" y2="75"/>
            <line x1="55" y1="55" x2="135" y2="55"/>
            <line x1="40" y1="40" x2="150" y2="40"/>
            <line x1="40" y1="70" x2="150" y2="70"/>
            <line x1="25" y1="55" x2="120" y2="55"/>
            <line x1="20" y1="75" x2="110" y2="75"/>
            
            <!-- Bridge structure -->
            <line x1="110" y1="30" x2="110" y2="90"/>
            <line x1="120" y1="35" x2="120" y2="85"/>
            <line x1="130" y1="30" x2="130" y2="90"/>
            <line x1="140" y1="35" x2="140" y2="85"/>
            <line x1="150" y1="30" x2="150" y2="90"/>
            <line x1="160" y1="35" x2="160" y2="85"/>
            <line x1="170" y1="30" x2="170" y2="90"/>
            <line x1="180" y1="35" x2="180" y2="85"/>
            <line x1="190" y1="30" x2="190" y2="90"/>
            
            <!-- Bridge cross-connections -->
            <line x1="110" y1="60" x2="190" y2="60"/>
            <line x1="120" y1="50" x2="180" y2="70"/>
            <line x1="130" y1="45" x2="170" y2="75"/>
            <line x1="140" y1="40" x2="160" y2="80"/>
            
            <!-- Right cluster connections from bridge -->
            <line x1="190" y1="30" x2="240" y2="40"/>
            <line x1="180" y1="35" x2="225" y2="55"/>
            <line x1="170" y1="30" x2="255" y2="55"/>
            <line x1="160" y1="35" x2="240" y2="70"/>
            <line x1="190" y1="90" x2="260" y2="75"/>
            <line x1="180" y1="85" x2="220" y2="75"/>
            
            <!-- Right cluster -->
            <circle cx="240" cy="40" r="3" fill="currentColor"/>
            <circle cx="225" cy="55" r="3" fill="currentColor"/>
            <circle cx="255" cy="55" r="3" fill="currentColor"/>
            <circle cx="240" cy="70" r="3" fill="currentColor"/>
            <circle cx="220" cy="75" r="3" fill="currentColor"/>
            <circle cx="260" cy="75" r="3" fill="currentColor"/>
            
            <!-- Right cluster connections -->
            <line x1="240" y1="40" x2="225" y2="55"/>
            <line x1="240" y1="40" x2="255" y2="55"/>
            <line x1="225" y1="55" x2="240" y2="70"/>
            <line x1="255" y1="55" x2="240" y2="70"/>
            <line x1="240" y1="70" x2="220" y2="75"/>
            <line x1="240" y1="70" x2="260" y2="75"/>
            <line x1="225" y1="55" x2="220" y2="75"/>
            <line x1="255" y1="55" x2="260" y2="75"/>
        </svg>`,
    
    'augmented-decision-making': `
        <svg width="400" height="300" viewBox="0 0 400 300" fill="none" stroke="currentColor" stroke-width="1">
            <!-- Complex network with dense left cluster -->
            <g opacity="0.7">
                <!-- Dense cluster nodes -->
                <circle cx="50" cy="50" r="2" fill="currentColor"/>
                <circle cx="45" cy="65" r="2" fill="currentColor"/>
                <circle cx="35" cy="80" r="2" fill="currentColor"/>
                <circle cx="65" cy="75" r="2" fill="currentColor"/>
                <circle cx="80" cy="60" r="2" fill="currentColor"/>
                <circle cx="25" cy="95" r="2" fill="currentColor"/>
                <circle cx="70" cy="95" r="2" fill="currentColor"/>
                <circle cx="30" cy="110" r="2" fill="currentColor"/>
                <circle cx="55" cy="105" r="2" fill="currentColor"/>
                <circle cx="75" cy="120" r="2" fill="currentColor"/>
                <circle cx="40" cy="125" r="2" fill="currentColor"/>
                <circle cx="60" cy="135" r="2" fill="currentColor"/>
                <circle cx="85" cy="140" r="2" fill="currentColor"/>
                <circle cx="20" cy="130" r="2" fill="currentColor"/>
                <circle cx="90" cy="80" r="2" fill="currentColor"/>
                <circle cx="100" cy="100" r="2" fill="currentColor"/>
                <circle cx="15" cy="70" r="2" fill="currentColor"/>
                <circle cx="95" cy="115" r="2" fill="currentColor"/>
                
                <!-- Many connections creating dense network -->
                <line x1="50" y1="50" x2="45" y2="65"/>
                <line x1="50" y1="50" x2="80" y2="60"/>
                <line x1="45" y1="65" x2="35" y2="80"/>
                <line x1="45" y1="65" x2="65" y2="75"/>
                <line x1="35" y1="80" x2="25" y2="95"/>
                <line x1="65" y1="75" x2="80" y2="60"/>
                <line x1="65" y1="75" x2="70" y2="95"/>
                <line x1="80" y1="60" x2="90" y2="80"/>
                <line x1="25" y1="95" x2="30" y2="110"/>
                <line x1="70" y1="95" x2="55" y2="105"/>
                <line x1="30" y1="110" x2="40" y2="125"/>
                <line x1="55" y1="105" x2="75" y2="120"/>
                <line x1="75" y1="120" x2="85" y2="140"/>
                <line x1="40" y1="125" x2="60" y2="135"/>
                <line x1="60" y1="135" x2="85" y2="140"/>
                <line x1="20" y1="130" x2="40" y2="125"/>
                <line x1="90" y1="80" x2="100" y2="100"/>
                <line x1="100" y1="100" x2="95" y2="115"/>
                <line x1="15" y1="70" x2="35" y2="80"/>
                <line x1="95" y1="115" x2="75" y2="120"/>
                
                <!-- Additional cross connections for density -->
                <line x1="50" y1="50" x2="35" y2="80"/>
                <line x1="45" y1="65" x2="80" y2="60"/>
                <line x1="35" y1="80" x2="70" y2="95"/>
                <line x1="25" y1="95" x2="55" y2="105"/>
                <line x1="30" y1="110" x2="75" y2="120"/>
                <line x1="40" y1="125" x2="85" y2="140"/>
                <line x1="15" y1="70" x2="65" y2="75"/>
                <line x1="90" y1="80" x2="70" y2="95"/>
            </g>
            
            <!-- Central processing node (geometric shape) -->
            <g transform="translate(220,150)">
                <!-- Octagonal shape -->
                <polygon points="0,-30 20,-20 30,0 20,20 0,30 -20,20 -30,0 -20,-20" 
                         fill="none" stroke="currentColor" stroke-width="2"/>
                <!-- Inner connections -->
                <line x1="0" y1="-30" x2="0" y2="30" stroke-width="1"/>
                <line x1="-30" y1="0" x2="30" y2="0" stroke-width="1"/>
                <line x1="-20" y1="-20" x2="20" y2="20" stroke-width="1"/>
                <line x1="20" y1="-20" x2="-20" y2="20" stroke-width="1"/>
                <!-- Small center node -->
                <circle cx="0" cy="0" r="3" fill="currentColor"/>
            </g>
            
            <!-- Connections from cluster to central node -->
            <line x1="100" y1="100" x2="190" y2="140"/>
            <line x1="95" y1="115" x2="190" y2="150"/>
            <line x1="85" y1="140" x2="190" y2="160"/>
            <line x1="75" y1="120" x2="190" y2="155"/>
            <line x1="90" y1="80" x2="200" y2="130"/>
            <line x1="80" y1="60" x2="205" y2="125"/>
            <line x1="70" y1="95" x2="195" y2="145"/>
            
            <!-- Output connections (linear chain) -->
            <circle cx="280" cy="150" r="3" fill="currentColor"/>
            <circle cx="300" cy="150" r="3" fill="currentColor"/>
            <circle cx="320" cy="150" r="3" fill="currentColor"/>
            <circle cx="340" cy="150" r="3" fill="currentColor"/>
            <circle cx="360" cy="150" r="3" fill="currentColor"/>
            <circle cx="380" cy="150" r="3" fill="currentColor"/>
            
            <line x1="250" y1="150" x2="280" y2="150"/>
            <line x1="280" y1="150" x2="300" y2="150"/>
            <line x1="300" y1="150" x2="320" y2="150"/>
            <line x1="320" y1="150" x2="340" y2="150"/>
            <line x1="340" y1="150" x2="360" y2="150"/>
            <line x1="360" y1="150" x2="380" y2="150"/>
        </svg>`,
    
    'collective-epistemics': `
        <svg width="400" height="300" viewBox="0 0 400 300" fill="none" stroke="currentColor" stroke-width="1">
            <!-- Scattered nodes representing diverse knowledge sources -->
            <circle cx="50" cy="50" r="3"/>
            <circle cx="120" cy="40" r="3"/>
            <circle cx="90" cy="80" r="3"/>
            <circle cx="180" cy="30" r="3"/>
            <circle cx="220" cy="70" r="3"/>
            <circle cx="350" cy="60" r="3"/>
            <circle cx="30" cy="120" r="3"/>
            <circle cx="80" cy="140" r="3"/>
            <circle cx="160" cy="100" r="3"/>
            <circle cx="300" cy="90" r="3"/>
            <circle cx="370" cy="120" r="3"/>
            <circle cx="40" cy="180" r="3"/>
            <circle cx="110" cy="200" r="3"/>
            <circle cx="200" cy="180" r="3"/>
            <circle cx="280" cy="200" r="3"/>
            <circle cx="340" cy="180" r="3"/>
            <circle cx="60" cy="240" r="3"/>
            <circle cx="150" cy="250" r="3"/>
            <circle cx="250" cy="240" r="3"/>
            <circle cx="320" cy="260" r="3"/>
            
            <!-- Fill some circles to show different types -->
            <circle cx="50" cy="50" r="3" fill="currentColor"/>
            <circle cx="180" cy="30" r="3" fill="currentColor"/>
            <circle cx="220" cy="70" r="3" fill="currentColor"/>
            <circle cx="160" cy="100" r="3" fill="currentColor"/>
            <circle cx="200" cy="180" r="3" fill="currentColor"/>
            <circle cx="250" cy="240" r="3" fill="currentColor"/>
            
            <!-- Central coordination cluster -->
            <g transform="translate(200,150)">
                <!-- Central nodes in coordination pattern -->
                <circle cx="0" cy="0" r="4" fill="none" stroke-width="2"/>
                <circle cx="-15" cy="-10" r="3"/>
                <circle cx="15" cy="-10" r="3"/>
                <circle cx="-10" cy="12" r="3"/>
                <circle cx="10" cy="12" r="3"/>
                <circle cx="0" cy="-20" r="3"/>
                <circle cx="0" cy="20" r="3"/>
                
                <!-- Central cluster connections -->
                <line x1="0" y1="0" x2="-15" y2="-10"/>
                <line x1="0" y1="0" x2="15" y2="-10"/>
                <line x1="0" y1="0" x2="-10" y2="12"/>
                <line x1="0" y1="0" x2="10" y2="12"/>
                <line x1="0" y1="0" x2="0" y2="-20"/>
                <line x1="0" y1="0" x2="0" y2="20"/>
                <line x1="-15" y1="-10" x2="15" y2="-10"/>
                <line x1="-10" y1="12" x2="10" y2="12"/>
            </g>
            
            <!-- Connections from scattered nodes to central coordination -->
            <line x1="50" y1="50" x2="185" y2="140"/>
            <line x1="120" y1="40" x2="190" y2="130"/>
            <line x1="180" y1="30" x2="200" y2="130"/>
            <line x1="350" y1="60" x2="215" y2="140"/>
            <line x1="30" y1="120" x2="185" y2="150"/>
            <line x1="160" y1="100" x2="200" y2="140"/>
            <line x1="370" y1="120" x2="210" y2="155"/>
            <line x1="40" y1="180" x2="185" y2="160"/>
            <line x1="200" y1="180" x2="200" y2="170"/>
            <line x1="340" y1="180" x2="215" y2="160"/>
            <line x1="150" y1="250" x2="195" y2="170"/>
            <line x1="250" y1="240" x2="205" y2="170"/>
            
            <!-- Additional peripheral connections -->
            <circle cx="80" cy="20" r="2"/>
            <circle cx="300" cy="40" r="2"/>
            <circle cx="20" cy="200" r="2"/>
            <circle cx="380" cy="200" r="2"/>
            <circle cx="100" cy="280" r="2"/>
            <circle cx="300" cy="280" r="2"/>
            
            <!-- Small peripheral clusters -->
            <g transform="translate(320,30)">
                <circle cx="0" cy="0" r="2"/>
                <circle cx="8" cy="5" r="2"/>
                <circle cx="-5" cy="8" r="2"/>
                <line x1="0" y1="0" x2="8" y2="5"/>
                <line x1="0" y1="0" x2="-5" y2="8"/>
            </g>
            
            <g transform="translate(70,270)">
                <circle cx="0" cy="0" r="2"/>
                <circle cx="-8" cy="-5" r="2"/>
                <circle cx="5" cy="-8" r="2"/>
                <line x1="0" y1="0" x2="-8" y2="-5"/>
                <line x1="0" y1="0" x2="5" y2="-8"/>
            </g>
        </svg>`
};

// Generate theory page
const theoryHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Theory - AI for Epistemics & Coordination</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="container">
        <!-- Navigation -->
        <nav class="main-nav">
            <ul>
                <li><a href="index.html">Fellowship</a></li>
                <li><a href="theory.html" class="active">Theory</a></li>
            </ul>
        </nav>
        
        <!-- Theory Hero Section -->
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

            <h1 class="hero-title">${theory.frontmatter.title}</h1>
            <p class="hero-subtitle">
                ${theory.frontmatter.description}
            </p>
        </section>

        <!-- Theory Introduction -->
        <section class="theory-intro">
            <div class="theory-content">
                ${theory.content}
            </div>
        </section>

        <!-- Theory Sections -->
        ${theorySections.length > 0 ? theorySections.map(section => `
            <section class="theory-section" id="${section.id}">
                <div class="theory-section-content">
                    <div class="theory-text">
                        <div class="theory-section-body">
                            ${section.content}
                        </div>
                    </div>
                    <div class="theory-diagram">
                        <div class="diagram-container">
                            ${theoryDiagrams[section.id] || ''}
                            <h3 class="diagram-label">${section.title}</h3>
                        </div>
                    </div>
                </div>
            </section>
        `).join('') : ''}
    </div>
</body>
</html>`;

// Create output directory
const outputDir = path.join(__dirname, 'dist');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Copy assets to output directory
const assetsDir = path.join(outputDir, 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// Copy CSS files
const cssDir = path.join(assetsDir, 'css');
if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
}

fs.copyFileSync(
    path.join(__dirname, 'assets', 'css', 'style.css'), 
    path.join(cssDir, 'style.css')
);

// Copy image files
const imagesDir = path.join(assetsDir, 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Copy all images from assets/images to dist/assets/images
const assetsImagesPath = path.join(__dirname, 'assets', 'images');
if (fs.existsSync(assetsImagesPath)) {
    // Function to recursively copy directories
    function copyDir(src, dest) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        const items = fs.readdirSync(src);
        items.forEach(item => {
            const srcPath = path.join(src, item);
            const destPath = path.join(dest, item);

            if (fs.statSync(srcPath).isDirectory()) {
                copyDir(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        });
    }

    copyDir(assetsImagesPath, imagesDir);
}

// Write the generated HTML files to output directory
fs.writeFileSync(path.join(outputDir, 'index.html'), html);
fs.writeFileSync(path.join(outputDir, 'fellowship.html'), fellowshipHtml);
fs.writeFileSync(path.join(outputDir, 'projects.html'), projectsListingHtml);
fs.writeFileSync(path.join(outputDir, 'theory.html'), theoryHtml);

// Generate individual project pages
projects.forEach(project => {
    const projectPageHtml = generateProjectPage(project);
    fs.writeFileSync(path.join(outputDir, `project-${project.slug}.html`), projectPageHtml);
});

console.log('✅ All pages generated successfully from markdown files!');
console.log(`📄 Generated: index.html, fellowship.html, projects.html, theory.html, and ${projects.length} project pages`);
console.log(`📁 Output directory: ${outputDir}`);
console.log('🚀 Ready for deployment! Drag the "dist" folder to Netlify.');
console.log('📝 Edit content in the content/ folder, then run "npm run build" to regenerate.');