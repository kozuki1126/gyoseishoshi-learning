import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const SVG_NS = 'http://www.w3.org/2000/svg';
const DEFAULT_SCROLL_OFFSET = 112;

const MATERIAL_ICON_DEFINITIONS = {
  gavel: [
    ['path', { d: 'm14 13-7.5 7.5c-.83.83-2.17.83-3 0a2.12 2.12 0 0 1 0-3L11 10' }],
    ['path', { d: 'm16 16 6-6' }],
    ['path', { d: 'm8 8 6-6' }],
    ['path', { d: 'm9 7 8 8' }],
    ['path', { d: 'm21 11-8-8' }],
  ],
  school: [
    ['path', { d: 'm4 6 8-4 8 4' }],
    ['path', { d: 'm18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2' }],
    ['path', { d: 'M14 22v-4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4' }],
    ['path', { d: 'M18 5v17' }],
    ['path', { d: 'M6 5v17' }],
    ['circle', { cx: '12', cy: '9', r: '2' }],
  ],
  account_tree: [
    ['line', { x1: '6', x2: '6', y1: '3', y2: '15' }],
    ['circle', { cx: '18', cy: '6', r: '3' }],
    ['circle', { cx: '6', cy: '18', r: '3' }],
    ['path', { d: 'M18 9a9 9 0 0 1-9 9' }],
  ],
  lightbulb: [
    ['path', { d: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5' }],
    ['path', { d: 'M9 18h6' }],
    ['path', { d: 'M10 22h4' }],
  ],
  auto_stories: [
    ['path', { d: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z' }],
    ['path', { d: 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' }],
  ],
  compare_arrows: [
    ['path', { d: 'M8 3 4 7l4 4' }],
    ['path', { d: 'M4 7h16' }],
    ['path', { d: 'm16 21 4-4-4-4' }],
    ['path', { d: 'M20 17H4' }],
  ],
  warning: [
    ['path', { d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z' }],
    ['path', { d: 'M12 9v4' }],
    ['path', { d: 'M12 17h.01' }],
  ],
  check_circle: [
    ['path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }],
    ['polyline', { points: '22 4 12 14.01 9 11.01' }],
  ],
  cancel: [
    ['circle', { cx: '12', cy: '12', r: '10' }],
    ['path', { d: 'm15 9-6 6' }],
    ['path', { d: 'm9 9 6 6' }],
  ],
  account_balance: [
    ['line', { x1: '3', x2: '21', y1: '22', y2: '22' }],
    ['line', { x1: '6', x2: '6', y1: '18', y2: '11' }],
    ['line', { x1: '10', x2: '10', y1: '18', y2: '11' }],
    ['line', { x1: '14', x2: '14', y1: '18', y2: '11' }],
    ['line', { x1: '18', x2: '18', y1: '18', y2: '11' }],
    ['polygon', { points: '12 2 20 7 4 7' }],
  ],
  event: [
    ['rect', { x: '3', y: '4', width: '18', height: '18', rx: '2', ry: '2' }],
    ['line', { x1: '16', x2: '16', y1: '2', y2: '6' }],
    ['line', { x1: '8', x2: '8', y1: '2', y2: '6' }],
    ['line', { x1: '3', x2: '21', y1: '10', y2: '10' }],
    ['path', { d: 'M8 14h.01' }],
    ['path', { d: 'M12 14h.01' }],
    ['path', { d: 'M16 14h.01' }],
    ['path', { d: 'M8 18h.01' }],
    ['path', { d: 'M12 18h.01' }],
    ['path', { d: 'M16 18h.01' }],
  ],
  book: [
    ['path', { d: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z' }],
    ['path', { d: 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' }],
  ],
  label: [
    ['path', { d: 'M12 2H2v10l9.29 9.29a2.42 2.42 0 0 0 3.42 0l6.58-6.58a2.42 2.42 0 0 0 0-3.42L12 2Z' }],
    ['path', { d: 'M7 7h.01' }],
  ],
  history: [
    ['path', { d: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' }],
    ['path', { d: 'M3 3v5h5' }],
    ['path', { d: 'M12 7v5l4 2' }],
  ],
  link: [
    ['path', { d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' }],
    ['path', { d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' }],
  ],
  info: [
    ['circle', { cx: '12', cy: '12', r: '10' }],
    ['path', { d: 'M12 16v-4' }],
    ['path', { d: 'M12 8h.01' }],
  ],
};

function normalizeDocumentCss(css = '') {
  return String(css)
    .replace(/:root\b/g, ':host, .html-document-body, .unit-html-root')
    .replace(/\bbody\b/g, '.html-document-body');
}

function createMaterialIconSvg(document, iconName) {
  const definition = MATERIAL_ICON_DEFINITIONS[iconName];
  if (!definition) {
    return null;
  }

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '1em');
  svg.setAttribute('height', '1em');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('material-icon-svg');

  definition.forEach(([tagName, attributes]) => {
    const node = document.createElementNS(SVG_NS, tagName);
    Object.entries(attributes).forEach(([name, value]) => {
      node.setAttribute(name, value);
    });
    svg.appendChild(node);
  });

  return svg;
}

function replaceMaterialIcons(root) {
  const icons = root.querySelectorAll(
    '[class~="material-icons"], [class*="material-icons-"]',
  );

  icons.forEach((icon) => {
    const iconName = icon.textContent?.trim();
    if (!iconName) {
      return;
    }

    const svg = createMaterialIconSvg(root.ownerDocument, iconName);
    if (!svg) {
      return;
    }

    icon.setAttribute('data-material-icon', iconName);
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '';
    icon.appendChild(svg);
  });
}

function escapeHtmlAttribute(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getInitialMarkup(stylesheets, css, html) {
  const documentCss = normalizeDocumentCss(css);
  const stylesheetLinks = Array.from(new Set(stylesheets || []))
    .map((href) => `<link rel="stylesheet" href="${escapeHtmlAttribute(href)}">`)
    .join('\n');

  return `
    ${stylesheetLinks}
    <style>
      :host {
        display: block;
      }

      .html-document-body,
      .unit-html-root {
        color: #1f2937;
      }

      .html-document-body {
        background: #f8fafc;
        border-radius: 18px;
        padding: 16px;
        font-family: 'Hiragino Sans', 'Yu Gothic', Meiryo, sans-serif;
        line-height: 1.8;
      }

      .unit-html-root,
      .unit-html-root * {
        box-sizing: border-box;
      }

      .unit-html-root a {
        color: #2563eb;
      }

      .unit-html-root [class~="material-icons"],
      .unit-html-root [class*="material-icons-"] {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        vertical-align: middle;
        line-height: 1;
      }

      .unit-html-root .material-icon-svg {
        display: block;
        overflow: visible;
      }

      .unit-html-root .table-wrap {
        border: 1px solid #cbd5e1;
        border-radius: 12px;
        background: #ffffff;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
      }

      .unit-html-root table thead th,
      .unit-html-root table tbody td {
        border-color: #94a3b8 !important;
      }

      .unit-html-root table thead th {
        border-bottom-width: 2px !important;
      }

      .unit-html-root .divider,
      .unit-html-root hr {
        border-top-color: #94a3b8 !important;
        opacity: 1;
      }

      .unit-html-root .section-header,
      .unit-html-root .term-card,
      .unit-html-root .diagram-wrap,
      .unit-html-root .col-box,
      .unit-html-root .box-definition {
        border-color: #cbd5e1 !important;
      }

      .unit-html-root .section-header h2,
      .unit-html-root .section-header h3,
      .unit-html-root .section-header h4,
      .unit-html-root .section-header p {
        margin-top: 0 !important;
      }

      .unit-html-root h2[id],
      .unit-html-root h3[id] {
        scroll-margin-top: ${DEFAULT_SCROLL_OFFSET}px;
      }

      ${documentCss}
    </style>
    <div class="html-document-body">
      <div class="unit-html-root">${html || ''}</div>
    </div>
  `;
}

const HtmlContentRenderer = forwardRef(function HtmlContentRenderer(
  { html, css, stylesheets = [], className = '' },
  ref,
) {
  const hostRef = useRef(null);
  const shadowRootRef = useRef(null);

  useImperativeHandle(ref, () => ({
    scrollToHeading(id, offset = DEFAULT_SCROLL_OFFSET) {
      const target = shadowRootRef.current?.getElementById(id);
      if (!target) {
        return false;
      }

      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: Math.max(0, top),
        behavior: 'smooth',
      });
      return true;
    },
  }), []);

  useEffect(() => {
    let cancelled = false;

    async function renderContent() {
      if (!hostRef.current) {
        return;
      }

      if (!shadowRootRef.current) {
        shadowRootRef.current = hostRef.current.attachShadow({ mode: 'open' });
      }

      const DOMPurify = (await import('dompurify')).default;
      const safeHtml = DOMPurify.sanitize(html || '', {
        USE_PROFILES: { html: true, svg: true, svgFilters: true },
      });

      if (cancelled || !shadowRootRef.current) {
        return;
      }

      shadowRootRef.current.innerHTML = getInitialMarkup(stylesheets, css, safeHtml);
      replaceMaterialIcons(shadowRootRef.current);
    }

    renderContent();

    return () => {
      cancelled = true;
    };
  }, [css, html, stylesheets]);

  return <div ref={hostRef} className={className} />;
});

export default HtmlContentRenderer;
