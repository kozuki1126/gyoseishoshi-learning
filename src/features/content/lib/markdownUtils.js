function slugifyHeading(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
}

export function extractMarkdownSections(markdown = '') {
  const lines = markdown.split(/\r?\n/);
  const sections = [];
  let topLevelSectionNumber = 0;

  lines.forEach((line) => {
    const match = line.match(/^(##|###)\s+(.+)$/);
    if (!match) {
      return;
    }

    const [, hashes, title] = match;
    const level = hashes.length;
    const isTopLevelSection = level === 2;

    if (isTopLevelSection) {
      topLevelSectionNumber += 1;
    }

    sections.push({
      id: slugifyHeading(title),
      title: title.trim(),
      level,
      number: isTopLevelSection ? String(topLevelSectionNumber) : null,
    });
  });

  return sections;
}

export function extractMarkdownSummary(markdown = '') {
  const lines = markdown.split(/\r?\n/).map((line) => line.trim());
  const summary = lines.find((line) => line && !line.startsWith('#'));
  return summary || '';
}
