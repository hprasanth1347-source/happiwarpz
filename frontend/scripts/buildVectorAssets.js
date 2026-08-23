const fs = require('fs');
const path = require('path');

const dirs = [
  'public/images',
  'public/images/brand',
  'public/images/products/roses',
  'public/images/products/sunflowers',
  'public/images/products/keychains',
  'public/images/products/custom',
];

dirs.forEach((dir) => {
  fs.mkdirSync(path.join(process.cwd(), dir), { recursive: true });
});

// Helper SVG generator wrapper
function makeSvg(width, height, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F4D068"/>
      <stop offset="50%" stop-color="#C9A24A"/>
      <stop offset="100%" stop-color="#8C6A1D"/>
    </linearGradient>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E50914"/>
      <stop offset="50%" stop-color="#900000"/>
      <stop offset="100%" stop-color="#4A0000"/>
    </linearGradient>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#181418"/>
      <stop offset="100%" stop-color="#080608"/>
    </linearGradient>
    <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFD700"/>
      <stop offset="70%" stop-color="#FFA500"/>
      <stop offset="100%" stop-color="#CC7700"/>
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  ${content}
</svg>`;
}

// 1. Logo SVG
const logoSvg = makeSvg(
  300,
  80,
  `
  <rect width="300" height="80" fill="transparent"/>
  <!-- Flower Emblem -->
  <g transform="translate(45, 40)">
    <circle cx="0" cy="0" r="22" fill="#120608" stroke="url(#goldGrad)" stroke-width="1.5"/>
    <path d="M0 -14 C-8 -22 -18 -8 0 0 C18 -8 8 -22 0 -14 Z" fill="url(#redGrad)"/>
    <path d="M-14 0 C-22 -8 -8 -18 0 0 C-8 18 -22 8 -14 0 Z" fill="url(#redGrad)"/>
    <path d="M0 14 C8 22 18 8 0 0 C-18 8 -8 22 0 14 Z" fill="url(#redGrad)"/>
    <path d="M14 0 C22 8 8 18 0 0 C8 -18 22 -8 14 0 Z" fill="url(#redGrad)"/>
    <circle cx="0" cy="0" r="5" fill="url(#goldGrad)"/>
  </g>
  <!-- Brand Text -->
  <text x="85" y="44" font-family="'Playfair Display', Georgia, serif" font-weight="bold" font-size="28" fill="#F8F1E7" letter-spacing="2">HAPPIWRAPZ</text>
  <text x="86" y="60" font-family="sans-serif" font-size="9" fill="url(#goldGrad)" letter-spacing="3">HANDMADE FLORAL GIFTS</text>
`
);

// 2. Rose Bouquet Product SVG
const roseBouquetSvg = makeSvg(
  600,
  600,
  `
  <rect width="600" height="600" fill="url(#bgGrad)"/>
  <circle cx="300" cy="270" r="180" fill="#8B0000" opacity="0.25" filter="url(#glow)"/>
  
  <!-- Bouquet Wrapping Paper -->
  <path d="M180 520 L300 240 L420 520 C360 560 240 560 180 520 Z" fill="#121012" stroke="url(#goldGrad)" stroke-width="2"/>
  <path d="M210 500 L300 270 L390 500" fill="none" stroke="#251E24" stroke-width="1.5"/>
  <!-- Gold Ribbon -->
  <path d="M250 440 Q300 460 350 440 Q330 490 300 470 Q270 490 250 440 Z" fill="url(#goldGrad)"/>

  <!-- Roses Cluster -->
  <g transform="translate(300, 220)">
    <!-- Central Rose -->
    <circle cx="0" cy="0" r="48" fill="url(#redGrad)" stroke="url(#goldGrad)" stroke-width="1.5"/>
    <path d="M-20 -10 C-30 -30 30 -30 20 -10 C30 20 -30 20 -20 -10 Z" fill="#D00000" opacity="0.8"/>
    <circle cx="0" cy="0" r="16" fill="#8B0000"/>

    <!-- Outer Roses -->
    <g transform="translate(-65, -30)"><circle cx="0" cy="0" r="38" fill="url(#redGrad)" stroke="url(#goldGrad)" stroke-width="1"/><circle cx="0" cy="0" r="12" fill="#600000"/></g>
    <g transform="translate(65, -30)"><circle cx="0" cy="0" r="38" fill="url(#redGrad)" stroke="url(#goldGrad)" stroke-width="1"/><circle cx="0" cy="0" r="12" fill="#600000"/></g>
    <g transform="translate(-45, -85)"><circle cx="0" cy="0" r="35" fill="url(#redGrad)" stroke="url(#goldGrad)" stroke-width="1"/><circle cx="0" cy="0" r="10" fill="#600000"/></g>
    <g transform="translate(45, -85)"><circle cx="0" cy="0" r="35" fill="url(#redGrad)" stroke="url(#goldGrad)" stroke-width="1"/><circle cx="0" cy="0" r="10" fill="#600000"/></g>
    <g transform="translate(0, -115)"><circle cx="0" cy="0" r="38" fill="url(#redGrad)" stroke="url(#goldGrad)" stroke-width="1"/><circle cx="0" cy="0" r="12" fill="#600000"/></g>
  </g>

  <!-- Sparkles / Glitter -->
  <circle cx="230" cy="160" r="4" fill="#F4D068" filter="url(#glow)"/>
  <circle cx="370" cy="140" r="5" fill="#F4D068" filter="url(#glow)"/>
  <circle cx="300" cy="110" r="4" fill="#FFFFFF" filter="url(#glow)"/>
  <circle cx="270" cy="240" r="4" fill="#F4D068" filter="url(#glow)"/>
  
  <text x="300" y="565" font-family="'Playfair Display', Georgia, serif" font-size="22" font-weight="bold" fill="#F8F1E7" text-anchor="middle" letter-spacing="1">Luxury Velvet Rose Bouquet</text>
`
);

// 3. Sunflower Bouquet Product SVG
const sunflowerBouquetSvg = makeSvg(
  600,
  600,
  `
  <rect width="600" height="600" fill="url(#bgGrad)"/>
  <circle cx="300" cy="270" r="180" fill="#FFA500" opacity="0.2" filter="url(#glow)"/>

  <!-- Wrapping Paper -->
  <path d="M190 520 L300 240 L410 520 C350 560 250 560 190 520 Z" fill="#1C1814" stroke="url(#goldGrad)" stroke-width="2"/>
  <!-- Jute Bow -->
  <path d="M260 440 Q300 460 340 440 Q320 480 300 460 Q280 480 260 440 Z" fill="#C9A24A"/>

  <!-- Sunflowers -->
  <g transform="translate(300, 210)">
    <g>
      <!-- Petals -->
      <path d="M0 -80 L14 -48 L0 -38 L-14 -48 Z" fill="url(#sunGrad)" transform="rotate(0)"/>
      <path d="M0 -80 L14 -48 L0 -38 L-14 -48 Z" fill="url(#sunGrad)" transform="rotate(30)"/>
      <path d="M0 -80 L14 -48 L0 -38 L-14 -48 Z" fill="url(#sunGrad)" transform="rotate(60)"/>
      <path d="M0 -80 L14 -48 L0 -38 L-14 -48 Z" fill="url(#sunGrad)" transform="rotate(90)"/>
      <path d="M0 -80 L14 -48 L0 -38 L-14 -48 Z" fill="url(#sunGrad)" transform="rotate(120)"/>
      <path d="M0 -80 L14 -48 L0 -38 L-14 -48 Z" fill="url(#sunGrad)" transform="rotate(150)"/>
      <path d="M0 -80 L14 -48 L0 -38 L-14 -48 Z" fill="url(#sunGrad)" transform="rotate(180)"/>
      <path d="M0 -80 L14 -48 L0 -38 L-14 -48 Z" fill="url(#sunGrad)" transform="rotate(210)"/>
      <path d="M0 -80 L14 -48 L0 -38 L-14 -48 Z" fill="url(#sunGrad)" transform="rotate(240)"/>
      <path d="M0 -80 L14 -48 L0 -38 L-14 -48 Z" fill="url(#sunGrad)" transform="rotate(270)"/>
      <path d="M0 -80 L14 -48 L0 -38 L-14 -48 Z" fill="url(#sunGrad)" transform="rotate(300)"/>
      <path d="M0 -80 L14 -48 L0 -38 L-14 -48 Z" fill="url(#sunGrad)" transform="rotate(330)"/>
      <!-- Brown Disc -->
      <circle cx="0" cy="0" r="38" fill="#3D2314" stroke="#663A1D" stroke-width="4"/>
      <circle cx="0" cy="0" r="28" fill="#29160B"/>
    </g>
  </g>

  <text x="300" y="565" font-family="'Playfair Display', Georgia, serif" font-size="22" font-weight="bold" fill="#F8F1E7" text-anchor="middle" letter-spacing="1">Sunshine Sunflower Bouquet</text>
`
);

// 4. Keychain SVG template generator
function makeKeychainSvg(title, color, emblem) {
  return makeSvg(
    500,
    500,
    `
    <rect width="500" height="500" fill="url(#bgGrad)"/>
    <circle cx="250" cy="250" r="160" fill="${color}" opacity="0.15" filter="url(#glow)"/>
    
    <!-- Metal Keyring -->
    <circle cx="250" cy="100" r="35" fill="none" stroke="url(#goldGrad)" stroke-width="8"/>
    <rect x="246" y="135" width="8" height="40" fill="url(#goldGrad)"/>
    <circle cx="250" cy="180" r="12" fill="url(#goldGrad)"/>

    <!-- Keychain Charm Body -->
    <g transform="translate(250, 280)">
      ${emblem}
    </g>

    <text x="250" y="455" font-family="'Playfair Display', Georgia, serif" font-size="22" font-weight="bold" fill="#F8F1E7" text-anchor="middle" letter-spacing="1">${title}</text>
    <text x="250" y="475" font-family="sans-serif" font-size="12" fill="url(#goldGrad)" text-anchor="middle" letter-spacing="2">HANDMADE KEYCHAIN</text>
  `
  );
}

// 5. Custom Hamper SVG
const customHamperSvg = makeSvg(
  600,
  600,
  `
  <rect width="600" height="600" fill="url(#bgGrad)"/>
  <circle cx="300" cy="300" r="200" fill="url(#goldGrad)" opacity="0.15" filter="url(#glow)"/>
  
  <!-- Luxury Gift Box Base -->
  <rect x="150" y="280" width="300" height="200" rx="12" fill="#181216" stroke="url(#goldGrad)" stroke-width="3"/>
  <rect x="135" y="240" width="330" height="50" rx="8" fill="#251820" stroke="url(#goldGrad)" stroke-width="3"/>
  
  <!-- Satin Ribbon -->
  <rect x="280" y="240" width="40" height="240" fill="url(#redGrad)"/>
  
  <!-- Ribbon Bow -->
  <path d="M220 200 Q300 240 220 250 Z" fill="url(#redGrad)" stroke="url(#goldGrad)" stroke-width="1.5"/>
  <path d="M380 200 Q300 240 380 250 Z" fill="url(#redGrad)" stroke="url(#goldGrad)" stroke-width="1.5"/>
  <circle cx="300" cy="240" r="16" fill="url(#goldGrad)"/>

  <!-- Overflowing Flowers -->
  <circle cx="220" cy="220" r="30" fill="url(#redGrad)"/>
  <circle cx="380" cy="220" r="30" fill="url(#sunGrad)"/>
  <circle cx="300" cy="180" r="35" fill="url(#redGrad)"/>

  <text x="300" y="565" font-family="'Playfair Display', Georgia, serif" font-size="22" font-weight="bold" fill="#F8F1E7" text-anchor="middle" letter-spacing="1">Personalized Custom Gift Box</text>
`
);

// Write SVG files (and PNG file copies with SVG extension support)
const writeDual = (filePath, content) => {
  fs.writeFileSync(filePath, content);
  // Also write as .png path so any legacy png reference loads valid SVG markup correctly
  const pngPath = filePath.replace(/\.svg$/, '.png');
  if (pngPath !== filePath) {
    fs.writeFileSync(pngPath, content);
  }
};

writeDual('public/images/brand/logo.svg', logoSvg);
writeDual('public/images/logo.png', logoSvg);
writeDual('public/images/logo.svg', logoSvg);
writeDual('public/images/products/roses/rose-bouquet.svg', roseBouquetSvg);
writeDual('public/images/products/sunflowers/sunflower-bouquet.svg', sunflowerBouquetSvg);
writeDual('public/images/products/custom/custom-hamper.svg', customHamperSvg);

const keychainsList = [
  { file: 'heart-trio.svg', name: 'Heart Trio', color: '#D00000', emblem: '<path d="M-40 -20 C-60 -50 0 -60 0 -20 C0 -60 60 -50 40 -20 C20 20 0 40 0 50 C0 40 -20 20 -40 -20 Z" fill="url(#redGrad)" stroke="url(#goldGrad)" stroke-width="3"/><path d="M-60 40 C-75 20 -30 10 -30 40 C-30 10 15 20 0 40 Z" fill="#E50914"/><path d="M20 50 C5 35 45 25 45 50 Z" fill="#8B0000"/>' },
  { file: 'dairy-delight.svg', name: 'Dairy Delight', color: '#FFFFFF', emblem: '<rect x="-45" y="-60" width="90" height="120" rx="15" fill="#F8F1E7" stroke="url(#goldGrad)" stroke-width="4"/><rect x="-35" y="-45" width="70" height="90" rx="8" fill="#3D2314"/><text x="0" y="10" font-family="sans-serif" font-weight="bold" font-size="16" fill="#F8F1E7" text-anchor="middle">MILK</text>' },
  { file: 'tulip-bloom.svg', name: 'Tulip Bloom', color: '#FF69B4', emblem: '<path d="M0 60 L0 -10 M-20 40 Q0 50 0 60 Q0 50 20 40" stroke="#4CAF50" stroke-width="6" fill="none"/><path d="M-35 -40 C-50 10 -10 40 0 40 C10 40 50 10 35 -40 C20 -60 0 -20 -35 -40 Z" fill="#FF1493" stroke="url(#goldGrad)" stroke-width="2"/>' },
  { file: 'love-heart.svg', name: 'Love Heart', color: '#D00000', emblem: '<path d="M-60 -30 C-90 -80 0 -90 0 -30 C0 -90 90 -80 60 -30 C30 30 0 70 0 80 C0 70 -30 30 -60 -30 Z" fill="url(#redGrad)" stroke="url(#goldGrad)" stroke-width="4"/><text x="0" y="5" font-family="serif" font-weight="bold" font-size="20" fill="#F8F1E7" text-anchor="middle">LOVE</text>' },
  { file: 'cherry-charm.svg', name: 'Cherry Charm', color: '#D00000', emblem: '<path d="M-25 0 Q0 -60 30 -10" stroke="#4CAF50" stroke-width="5" fill="none"/><circle cx="-30" cy="20" r="30" fill="url(#redGrad)" stroke="url(#goldGrad)" stroke-width="2"/><circle cx="25" cy="15" r="28" fill="url(#redGrad)" stroke="url(#goldGrad)" stroke-width="2"/>' },
  { file: 'bow-bliss.svg', name: 'Bow Bliss', color: '#E50914', emblem: '<path d="M-70 -40 Q0 0 -70 40 L0 0 Z" fill="url(#redGrad)" stroke="url(#goldGrad)" stroke-width="3"/><path d="M70 -40 Q0 0 70 40 L0 0 Z" fill="url(#redGrad)" stroke="url(#goldGrad)" stroke-width="3"/><circle cx="0" cy="0" r="15" fill="url(#goldGrad)"/>' },
  { file: 'blue-bouquet.svg', name: 'Blue Bouquet', color: '#1E90FF', emblem: '<path d="M-30 50 L0 0 L30 50 Z" fill="#121012" stroke="url(#goldGrad)" stroke-width="2"/><circle cx="-15" cy="-15" r="22" fill="#1E90FF"/><circle cx="15" cy="-15" r="22" fill="#00BFFF"/><circle cx="0" cy="-35" r="22" fill="#4169E1"/>' },
  { file: 'sunflower.svg', name: 'Sunflower', color: '#FFD700', emblem: '<circle cx="0" cy="0" r="55" fill="url(#sunGrad)" stroke="url(#goldGrad)" stroke-width="2"/><circle cx="0" cy="0" r="28" fill="#3D2314"/>' },
  { file: 'pretty-petal.svg', name: 'Pretty Petal', color: '#FFB6C1', emblem: '<circle cx="-25" cy="-25" r="25" fill="#FFC0CB"/><circle cx="25" cy="-25" r="25" fill="#FFC0CB"/><circle cx="-25" cy="25" r="25" fill="#FFC0CB"/><circle cx="25" cy="25" r="25" fill="#FFC0CB"/><circle cx="0" cy="0" r="18" fill="url(#goldGrad)"/>' },
  { file: 'jelly-fish.svg', name: 'Jelly Fish', color: '#9370DB', emblem: '<path d="M-50 0 C-50 -60 50 -60 50 0 C30 15 -30 15 -50 0 Z" fill="#9370DB" stroke="url(#goldGrad)" stroke-width="2"/><path d="M-30 10 Q-40 50 -20 80 M0 10 Q-10 60 10 80 M30 10 Q20 50 35 80" stroke="#BA55D3" stroke-width="4" fill="none"/>' },
  { file: 'strawberry.svg', name: 'Strawberry', color: '#FF4500', emblem: '<path d="M-45 -20 C-50 -60 50 -60 45 -20 C30 40 0 70 0 70 C0 70 -30 40 -45 -20 Z" fill="#FF4500" stroke="url(#goldGrad)" stroke-width="3"/><path d="M-30 -50 Q0 -30 30 -50 Q0 -65 -30 -50 Z" fill="#4CAF50"/>' },
  { file: 'paw-love.svg', name: 'Paw Love', color: '#F8F1E7', emblem: '<ellipse cx="0" cy="20" rx="35" ry="28" fill="#F8F1E7" stroke="url(#goldGrad)" stroke-width="3"/><circle cx="-35" cy="-20" r="14" fill="#F8F1E7"/><circle cx="-12" cy="-35" r="14" fill="#F8F1E7"/><circle cx="12" cy="-35" r="14" fill="#F8F1E7"/><circle cx="35" cy="-20" r="14" fill="#F8F1E7"/>' },
];

keychainsList.forEach((kc) => {
  writeDual(
    path.join('public/images/products/keychains', kc.file),
    makeKeychainSvg(kc.name, kc.color, kc.emblem)
  );
});

console.log('All SVG & PNG vector assets built successfully!');
