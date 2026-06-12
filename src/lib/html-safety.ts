const ALLOWED_TAGS = new Set([
  'a',
  'abbr',
  'article',
  'aside',
  'b',
  'blockquote',
  'br',
  'caption',
  'code',
  'col',
  'colgroup',
  'dd',
  'details',
  'div',
  'dl',
  'dt',
  'em',
  'figcaption',
  'figure',
  'footer',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hr',
  'i',
  'img',
  'li',
  'main',
  'mark',
  'ol',
  'p',
  'pre',
  's',
  'section',
  'small',
  'span',
  'strong',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'time',
  'tr',
  'u',
  'ul',
]);

const REMOVED_TAGS = new Set([
  'audio',
  'base',
  'embed',
  'form',
  'iframe',
  'link',
  'meta',
  'object',
  'script',
  'style',
  'video',
]);

const URL_ATTRS = new Set(['href', 'src']);
const ALLOWED_TARGETS = new Set(['_self', '_blank', '_parent', '_top']);
const SAFE_HREF_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

export function sanitizeHref(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('#') || trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed, 'https://www.cmyao.com');
    if (SAFE_HREF_PROTOCOLS.has(parsed.protocol)) return trimmed;
  } catch {
    // Invalid URL
  }

  return '';
}

function sanitizeAttribute(name: string, value: string): string | null {
  if (/^on/i.test(name)) return null;
  if (name === 'style' || name === 'srcdoc' || name === 'sandbox') return null;
  if (name === 'srcset') return null;
  if (name === 'target' && !ALLOWED_TARGETS.has(value)) return null;

  if (URL_ATTRS.has(name)) {
    return sanitizeHref(value);
  }

  return value;
}

function sanitizeNode(source: Node): Node[] {
  if (source.nodeType === Node.TEXT_NODE || source.nodeType === Node.COMMENT_NODE) {
    return [source.cloneNode(true)];
  }

  if (source.nodeType !== Node.ELEMENT_NODE) {
    return [];
  }

  const element = source as Element;
  const tag = element.tagName.toLowerCase();

  if (REMOVED_TAGS.has(tag)) {
    return [];
  }

  if (!ALLOWED_TAGS.has(tag)) {
    const extracted: Node[] = [];
    Array.from(element.childNodes).forEach((child) => {
      extracted.push(...sanitizeNode(child));
    });
    return extracted;
  }

  const output = document.createElement(tag);

  Array.from(element.attributes).forEach((attr) => {
    const name = attr.name.toLowerCase();
    const safe = sanitizeAttribute(name, attr.value);
    if (safe === null) return;

    output.setAttribute(name, safe);
  });

  if (tag === 'a') {
    if (output.getAttribute('href')) {
      const href = output.getAttribute('href') ?? '';
      if (href === '#' || sanitizeHref(href) === '') {
        output.removeAttribute('href');
      }
    }

    if (output.getAttribute('target') === '_blank' && !output.hasAttribute('rel')) {
      output.setAttribute('rel', 'noopener noreferrer');
    }
  }

  if (tag === 'img' && output.hasAttribute('src')) {
    const src = output.getAttribute('src') ?? '';
    if (sanitizeHref(src) === '') {
      output.removeAttribute('src');
    }
    if (!output.hasAttribute('loading')) {
      output.setAttribute('loading', 'lazy');
    }
  }

  Array.from(element.childNodes).forEach((child) => {
    sanitizeNode(child).forEach((cleanedChild) => {
      output.appendChild(cleanedChild);
    });
  });

  return [output];
}

export function sanitizeHtmlFragment(rawHtml: string): string {
  const doc = new DOMParser().parseFromString(rawHtml, 'text/html');
  const source = doc.body;
  const container = document.createElement('div');

  Array.from(source.childNodes).forEach((child) => {
    sanitizeNode(child).forEach((sanitized) => container.appendChild(sanitized));
  });

  return container.innerHTML;
}
