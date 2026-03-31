function slugifyHeading(value = '') {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
}

function decodeHtmlEntities(value = '') {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function stripTags(value = '') {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function stripMaterialIconSpans(value = '') {
  return String(value).replace(
    /<span[^>]*class=(['"])[^'"]*material-icons(?:-[^'"\s]+)?[^'"]*\1[^>]*>[\s\S]*?<\/span>/gi,
    ' ',
  );
}

function removeDangerousTags(value = '') {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[\s\S]*?>/gi, '')
    .replace(/<form[\s\S]*?<\/form>/gi, '')
    .replace(/<link[\s\S]*?>/gi, '')
    .replace(/<meta[\s\S]*?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
}

function extractBodyHtml(html = '') {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    return bodyMatch[1];
  }

  return html
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<html[\s\S]*?>/gi, '')
    .replace(/<\/html>/gi, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .trim();
}

function extractEmbeddedCss(html = '') {
  return Array.from(html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi))
    .map((match) => match[1].trim())
    .filter(Boolean)
    .join('\n\n');
}

function sanitizeStylesheetHref(value = '') {
  const href = String(value || '').trim();
  if (!href) {
    return null;
  }

  if (/^https:\/\/fonts\.googleapis\.com\//i.test(href)) {
    return href;
  }

  if (/^\/(?!\/)/.test(href)) {
    return href;
  }

  return null;
}

function extractExternalStylesheets(html = '') {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const head = headMatch?.[1] || '';

  return Array.from(head.matchAll(/<link\b[^>]*>/gi))
    .map((match) => {
      const tag = match[0];
      const relMatch = tag.match(/\brel=(['"])(.*?)\1/i);
      const hrefMatch = tag.match(/\bhref=(['"])(.*?)\1/i);
      if (!relMatch || !hrefMatch || relMatch[2].toLowerCase() !== 'stylesheet') {
        return null;
      }

      return sanitizeStylesheetHref(hrefMatch[2]);
    })
    .filter(Boolean);
}

function extractSectionNumberBeforeHeading(source = '', offset = 0) {
  const prefix = source.slice(Math.max(0, offset - 800), offset);
  const matches = Array.from(prefix.matchAll(
    /<header[^>]*class=(['"])[^'"]*section-header[^'"]*\1[^>]*>[\s\S]*?<div[^>]*class=(['"])[^'"]*section-header__number[^'"]*\2[^>]*>\s*([^<]+?)\s*<\/div>/gi,
  ));

  const sectionNumber = matches.at(-1)?.[3]?.trim();
  return sectionNumber || null;
}

function extractMaterialIconName(value = '') {
  const match = String(value).match(
    /<span[^>]*class=(['"])[^'"]*material-icons(?:-[^'"\s]+)?[^'"]*\1[^>]*>\s*([^<]+?)\s*<\/span>/i,
  );

  return match?.[2]?.trim() || null;
}

function ensureHeadingIds(html = '') {
  const sections = [];
  let topLevelSectionNumber = 0;

  const nextHtml = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs = '', inner = '', offset = 0, source = '') => {
    const iconName = extractMaterialIconName(inner);
    const title = stripTags(stripMaterialIconSpans(inner));
    if (!title) {
      return match;
    }

    const idMatch = attrs.match(/\sid=(['"])(.*?)\1/i);
    const id = idMatch?.[2] || slugifyHeading(title);
    const nextAttrs = idMatch ? attrs : `${attrs} id="${id}"`;

    const numericLevel = Number(level);
    const isTopLevelSection = numericLevel === 2;
    const extractedNumber = isTopLevelSection ? extractSectionNumberBeforeHeading(source, offset) : null;
    if (isTopLevelSection) {
      topLevelSectionNumber += 1;
    }

    sections.push({
      id,
      title,
      level: numericLevel,
      number: isTopLevelSection ? (extractedNumber || String(topLevelSectionNumber)) : null,
      iconName,
    });

    return `<h${level}${nextAttrs}>${inner}</h${level}>`;
  });

  return {
    html: nextHtml,
    sections,
  };
}

export function sanitizeEmbeddedCss(css = '') {
  return String(css)
    .replace(/<\/style/gi, '')
    .replace(/@import[\s\S]*?;/gi, '')
    .replace(/expression\s*\([^)]*\)/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/behavior\s*:[^;]+;?/gi, '')
    .replace(/-moz-binding\s*:[^;]+;?/gi, '')
    .trim();
}

export function extractHtmlSummary(html = '') {
  const paragraphMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (paragraphMatch) {
    return stripTags(paragraphMatch[1]);
  }

  return stripTags(html);
}

export function parseHtmlContentDocument(rawHtml = '') {
  const source = String(rawHtml || '');
  const titleMatch = source.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const css = sanitizeEmbeddedCss(extractEmbeddedCss(source));
  const stylesheets = extractExternalStylesheets(source);
  const body = removeDangerousTags(extractBodyHtml(source));
  const { html, sections } = ensureHeadingIds(body);

  return {
    title: titleMatch ? stripTags(titleMatch[1]) : '',
    html,
    css,
    stylesheets,
    sections,
    summary: extractHtmlSummary(html),
  };
}
