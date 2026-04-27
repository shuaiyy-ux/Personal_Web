/**
 * Scramble text effect — replaces characters with glyphs that settle into the final text.
 * Used on project title hover for an "AI decoding" feel.
 */

const GLYPHS = '!<>-_\\/[]{}=+*^?#~$%&|';

export function scramble(el: HTMLElement, finalText: string, durationMs = 520): () => void {
  let frameId = 0;
  const start = performance.now();
  const length = finalText.length;

  const frame = (now: number) => {
    const t = Math.min(1, (now - start) / durationMs);
    let out = '';
    for (let i = 0; i < length; i++) {
      const charProgress = t * length - i;
      const ch = finalText[i];
      if (charProgress >= 1 || ch === ' ') {
        out += ch;
      } else if (charProgress < 0) {
        out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      } else {
        out += Math.random() < charProgress
          ? ch
          : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
    }
    el.textContent = out;
    if (t < 1) {
      frameId = requestAnimationFrame(frame);
    } else {
      el.textContent = finalText;
    }
  };

  frameId = requestAnimationFrame(frame);

  return () => cancelAnimationFrame(frameId);
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
