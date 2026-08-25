// The ROOK smoke mark (verbatim from the brand vector artwork — do not redraw)
// and the small utility icon set. Stroke icons are 1.1–1.25px, no fills.

export function mark(cls = '') {
  return `<svg class="mark ${cls}" viewBox="0 0 3423 8013" fill="none" focusable="false" aria-hidden="true">
    <path d="M1385.323,0c686.227,1470.562 -635.128,2425.569 -1155.373,3482.998c-612.772,1245.495 139.679,2356.434 623.648,3166.079c-272.382,-1902.665 999.282,-2352.57 1499.317,-3419.704c835.646,-1783.364 -650.036,-2907.079 -967.593,-3229.373" fill="currentColor"/>
    <path d="M3180.886,3208.617c5.073,1177.651 -961.43,1678.066 -1453.573,2431.434c-579.672,887.357 -196.919,1785.118 177.829,2372.304c58.948,-1361.806 1045.499,-1626.839 1518.264,-2391.727c742.257,-1200.902 -28.678,-2168.308 -242.52,-2412.011" fill="currentColor"/>
  </svg>`;
}

const ICONS = {
  arrow: '<path d="M2 8h12M9.5 3.5 14 8l-4.5 4.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>',
  down: '<path d="M8 2v12M3.5 9.5 8 14l4.5-4.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>',
  close: '<path d="M3 3l10 10M13 3 3 13" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/>',
  check: '<path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>',
  instagram: '<rect x="2.2" y="2.2" width="11.6" height="11.6" rx="3.4" stroke="currentColor" stroke-width="1.2"/><circle cx="8" cy="8" r="2.9" stroke="currentColor" stroke-width="1.2"/><circle cx="11.5" cy="4.5" r=".9" fill="currentColor"/>',
  tiktok: '<path d="M9.4 2v7.6a2.3 2.3 0 1 1-1.9-2.26" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.4 2c.3 1.6 1.3 2.5 2.9 2.7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>',
  truck: '<path d="M1.5 4.5h8v6h-8zM9.5 6.5h2.6l1.9 2v2h-4.5z" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/><circle cx="4" cy="12" r="1.3" stroke="currentColor" stroke-width="1.1"/><circle cx="11.3" cy="12" r="1.3" stroke="currentColor" stroke-width="1.1"/>',
  shield: '<path d="M8 1.8l5 1.9v4c0 3-2.1 5.2-5 6.5-2.9-1.3-5-3.5-5-6.5v-4z" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/>',
  globe: '<circle cx="8" cy="8" r="6.1" stroke="currentColor" stroke-width="1.1"/><path d="M1.9 8h12.2M8 1.9c1.7 1.9 2.5 4 2.5 6.1S9.7 12.2 8 14.1C6.3 12.2 5.5 10.1 5.5 8S6.3 3.8 8 1.9z" stroke="currentColor" stroke-width="1.1"/>',
  phone: '<path d="M3 2.6h2.6l1.1 2.8-1.6 1a8.4 8.4 0 0 0 3.5 3.5l1-1.6 2.8 1.1v2.6a1 1 0 0 1-1.1 1A11 11 0 0 1 2 3.7a1 1 0 0 1 1-1.1z" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/>',
};

export function icon(name, size = 16) {
  const p = ICONS[name];
  if (!p) return '';
  return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" focusable="false" aria-hidden="true">${p}</svg>`;
}
