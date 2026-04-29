/**
 * SVG line-art icons for portfolio projects.
 * 48x48 viewBox, stroke-based, currentColor — inherit cyan accent from CSS.
 */

const iconSpecKit = `
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9 13 L9 35 M9 13 L13 13 M9 35 L13 35" />
    <path d="M39 13 L39 35 M39 13 L35 13 M39 35 L35 35" />
    <path d="M19 18 Q16 18 16 21 L16 27 Q16 30 19 30" />
    <path d="M29 18 Q32 18 32 21 L32 27 Q32 30 29 30" />
    <path d="M21 24 L27 24" stroke-dasharray="1 2" opacity="0.7" />
    <path d="M5 24 L9 24" opacity="0.4" />
    <path d="M39 24 L43 24" opacity="0.4" />
  </svg>
`;

const iconEmailDigest = `
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="8" y="13" width="32" height="22" rx="2" />
    <path d="M8 16 L24 26 L40 16" />
    <path d="M14 39 L18 39" stroke-width="1.8" />
    <path d="M22 39 L26 39" opacity="0.6" />
    <path d="M30 39 L34 39" opacity="0.4" />
    <circle cx="38" cy="11" r="2" fill="currentColor" stroke="none" opacity="0.85" />
  </svg>
`;

const iconVigil = `
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <ellipse cx="24" cy="24" rx="16" ry="9" />
    <circle cx="24" cy="24" r="4" />
    <circle cx="24" cy="24" r="1.5" fill="currentColor" stroke="none" />
    <path d="M5 24 L8 24" opacity="0.5" />
    <path d="M40 24 L43 24" opacity="0.5" />
    <path d="M24 5 L24 8" opacity="0.5" />
    <path d="M24 40 L24 43" opacity="0.5" />
    <path d="M11 13 L13 15" opacity="0.35" />
    <path d="M35 33 L37 35" opacity="0.35" />
    <path d="M37 13 L35 15" opacity="0.35" />
    <path d="M13 33 L11 35" opacity="0.35" />
  </svg>
`;

const iconFinanceAnalyzer = `
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M6 36 L42 36" opacity="0.35" />
    <path d="M8 32 L16 26 L24 28 L32 18 L40 20" />
    <circle cx="8" cy="32" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="16" cy="26" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="24" cy="28" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="32" cy="18" r="1.8" fill="currentColor" stroke="none" />
    <circle cx="40" cy="20" r="1.5" fill="currentColor" stroke="none" />
    <path d="M5 14 L43 14" stroke-dasharray="2 3" opacity="0.5" />
    <path d="M32 13 L32 15" opacity="0.6" />
  </svg>
`;

const iconDjSelector = `
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="22" cy="26" r="13" />
    <circle cx="22" cy="26" r="8" opacity="0.45" />
    <circle cx="22" cy="26" r="3.5" opacity="0.7" />
    <circle cx="22" cy="26" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="40" cy="11" r="1.6" fill="currentColor" stroke="none" opacity="0.85" />
    <path d="M 40 11 L 30 22" />
    <path d="M 30 22 L 27 24" stroke-width="2" />
  </svg>
`;

const iconToiletAlarm = `
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="24" cy="26" r="14" />
    <path d="M14 12 L11 9" opacity="0.65" />
    <path d="M34 12 L37 9" opacity="0.65" />
    <path d="M24 18 L24 26 L29 28" />
    <rect x="20" y="33" width="8" height="6" rx="1.5" stroke-width="1.25" />
    <circle cx="24" cy="36" r="1.6" fill="currentColor" stroke="none" />
    <path d="M27 31.5 L29 31.5" opacity="0.5" />
  </svg>
`;

const ICONS: Record<string, string> = {
  speckit: iconSpecKit,
  'finance-analyzer': iconFinanceAnalyzer,
  'email-digest': iconEmailDigest,
  vigil: iconVigil,
  'toilet-alarm': iconToiletAlarm,
  'dj-selector': iconDjSelector,
};

export function projectIcon(id: string): string {
  return ICONS[id] ?? '';
}
