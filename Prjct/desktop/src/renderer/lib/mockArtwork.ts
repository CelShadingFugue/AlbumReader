const palettes = [
  {
    sky: ['#10243a', '#f08b64'],
    far: '#284b58',
    near: '#0d2029',
    glow: '#ffd28a',
  },
  {
    sky: ['#22243c', '#cc6b7b'],
    far: '#4e4c72',
    near: '#171525',
    glow: '#ffcfb5',
  },
  {
    sky: ['#16313b', '#7fb8a8'],
    far: '#305c5a',
    near: '#102329',
    glow: '#f4e6b1',
  },
  {
    sky: ['#2a1e2f', '#e29d62'],
    far: '#70475b',
    near: '#211621',
    glow: '#ffd7a8',
  },
  {
    sky: ['#172935', '#a6bfc8'],
    far: '#617d83',
    near: '#15262d',
    glow: '#f8efd2',
  },
  {
    sky: ['#171f2f', '#4e8eaf'],
    far: '#31566e',
    near: '#0d1724',
    glow: '#cbeeff',
  },
];

function createMockArtwork(seed: number): string {
  const palette = palettes[seed % palettes.length]!;
  const skyId = `sky-${seed}`;
  const glowId = `glow-${seed}`;
  const sunX = 160 + ((seed * 97) % 480);
  const sunY = 130 + ((seed * 53) % 120);
  const ridgeOffset = 30 + ((seed * 31) % 110);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="${skyId}" x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0" stop-color="${palette.sky[0]}" />
          <stop offset="1" stop-color="${palette.sky[1]}" />
        </linearGradient>
        <radialGradient id="${glowId}" cx="50%" cy="50%" r="50%">
          <stop offset="0" stop-color="${palette.glow}" stop-opacity="0.95" />
          <stop offset="0.45" stop-color="${palette.glow}" stop-opacity="0.22" />
          <stop offset="1" stop-color="${palette.glow}" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="600" fill="url(#${skyId})" />
      <circle cx="${sunX}" cy="${sunY}" r="160" fill="url(#${glowId})" />
      <circle cx="${sunX}" cy="${sunY}" r="${34 + (seed % 4) * 8}" fill="${palette.glow}" opacity="0.86" />
      <path d="M0 356 L142 ${238 + ridgeOffset} L260 330 L390 ${214 + ridgeOffset / 2} L540 354 L690 246 L800 330 L800 600 L0 600 Z" fill="${palette.far}" opacity="0.92" />
      <path d="M0 448 L156 330 L302 432 L468 298 L624 430 L800 344 L800 600 L0 600 Z" fill="${palette.near}" opacity="0.98" />
      <path d="M0 520 C120 482 196 534 302 510 C438 478 512 520 628 502 C714 488 766 500 800 514 L800 600 L0 600 Z" fill="#071014" opacity="0.54" />
      <rect x="42" y="44" width="${86 + (seed % 3) * 24}" height="8" rx="4" fill="#ffffff" opacity="0.18" />
      <rect x="42" y="62" width="${54 + (seed % 4) * 12}" height="5" rx="2.5" fill="#ffffff" opacity="0.12" />
    </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const artworkFor = createMockArtwork;
