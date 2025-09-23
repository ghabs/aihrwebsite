// Script to generate fellow profile markdown files
const fs = require('fs');
const path = require('path');

const fellowNames = [
  'Fellow', 'Gengnt', 'Mengr', 'Kanar', 'Reolon', 'Callion', // existing 6
  'Alexon', 'Brythe', 'Carlen', 'Delmar', 'Evren', 'Falon',
  'Gareth', 'Harion', 'Idris', 'Joren', 'Kaethe', 'Lyron',
  'Miren', 'Nolan', 'Orian', 'Peren', 'Quill', 'Raven',
  'Seren', 'Thane', 'Ulric', 'Valen', 'Wren', 'Xylan'
];

const descriptions = [
  'Then unalext filter are hargle',
  'Prelivs suekchanflarting ehtolatny',
  'Frcen countatuonln',
  'Oxgenred oamm elles',
  'Fliolem seealahe spoh',
  'Shoels slirtf mitees dre fouclolng',
  'Morgen thale vicken sorth',
  'Pelten gravis molten core',
  'Nexal forms brewing concepts',
  'Quithen moren flaxed systems',
  'Brantel codes merging protocols',
  'Zenith frameworks building bridges',
  'Cosmic patterns weaving solutions',
  'Digital realms exploring frontiers',
  'Neural networks processing insights',
  'Quantum theories examining possibilities',
  'Synthetic minds crafting futures',
  'Algorithmic approaches discovering truths',
  'Cognitive systems enhancing reasoning',
  'Computational models advancing knowledge',
  'Intelligent agents facilitating coordination',
  'Automated processes streamlining workflows',
  'Machine learning optimizing outcomes',
  'Data structures organizing information',
  'Information systems connecting communities',
  'Knowledge graphs mapping relationships',
  'Semantic networks understanding context',
  'Logical frameworks supporting decisions',
  'Reasoning engines powering analysis',
  'Inference mechanisms driving conclusions'
];

function generateFellowMarkdown(name, description, index) {
  return `---
name: "${name}"
description: "${description}"
order: ${index + 1}
---

# ${name}

${description}

## Research Focus

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Projects

- Project 1: Description of ongoing work
- Project 2: Additional research initiative
- Project 3: Collaboration with other fellows

## Background

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
`;
}

// Create content/fellows directory if it doesn't exist
const fellowsDir = path.join(__dirname, 'content', 'fellows');
if (!fs.existsSync(fellowsDir)) {
  fs.mkdirSync(fellowsDir, { recursive: true });
}

// Generate markdown files for all 30 fellows
for (let i = 0; i < 30; i++) {
  const filename = fellowNames[i].toLowerCase() + '.md';
  const filepath = path.join(fellowsDir, filename);
  const content = generateFellowMarkdown(fellowNames[i], descriptions[i], i);
  
  fs.writeFileSync(filepath, content);
  console.log(`Generated: ${filename}`);
}

console.log(`\nGenerated ${fellowNames.length} fellow markdown files in content/fellows/`);